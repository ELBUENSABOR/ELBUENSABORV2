package com.utn.elbuensabor.services.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.utn.elbuensabor.dtos.*;
import com.utn.elbuensabor.entities.ImagenInsumo;
import com.utn.elbuensabor.entities.SucursalInsumo;
import com.utn.elbuensabor.entities.UnidadMedida;
import com.utn.elbuensabor.services.ArticuloInsumoService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.entities.ArticuloInsumo;
import com.utn.elbuensabor.entities.CategoriaArticuloInsumo;
import com.utn.elbuensabor.repositories.ArticuloInsumoRepository;
import com.utn.elbuensabor.repositories.CategoriaArticuloInsumoRepository;

import com.utn.elbuensabor.repositories.UnidadMedidaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticuloInsumoServiceImpl implements ArticuloInsumoService {

    private static final String INSUMO_UPLOADS_PREFIX = "/uploads/insumos/";
    private final ArticuloInsumoRepository insumoRepo;
    private final CategoriaArticuloInsumoRepository categoriaRepo;
    private final UnidadMedidaRepository unidadMedidaRepo;
    private final com.utn.elbuensabor.repositories.SucursalEmpresaRepository sucursalRepo;

    public List<ArticuloInsumoResponse> getAll() {
        return insumoRepo.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ArticuloInsumoResponse getById(Long id) {
        ArticuloInsumo insumo = insumoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
        return toResponse(insumo);
    }

    @Transactional
    public ArticuloInsumoResponse create(ArticuloInsumoRequest request) {
        ArticuloInsumo insumo = new ArticuloInsumo();
        fillFromRequest(insumo, request);
        insumoRepo.save(insumo);
        return toResponse(insumo);
    }

    @Transactional
    public ArticuloInsumoResponse update(Long id, ArticuloInsumoRequest request) {
        ArticuloInsumo insumo = insumoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
        fillFromRequest(insumo, request);
        return toResponse(insumo);
    }

    public void delete(Long id) {
        ArticuloInsumo insumo = insumoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
        insumo.setActivo(false);
        insumoRepo.save(insumo);
    }

    public void reactivate(Long id) {
        ArticuloInsumo insumo = insumoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
        insumo.setActivo(true);
        insumoRepo.save(insumo);
    }

    public void fillFromRequest(ArticuloInsumo insumo, ArticuloInsumoRequest request) {
        CategoriaArticuloInsumo categoria = categoriaRepo.findById(request.categoriaId())
                .orElseThrow(() -> new RuntimeException("Rubro de insumo no encontrado"));

        if (request.unidadMedidaId() != null) {
            var unidadMedida = unidadMedidaRepo.findById(request.unidadMedidaId())
                    .orElseThrow(() -> new RuntimeException("Unidad de medida no encontrada"));
            insumo.setUnidadMedida(unidadMedida);
        }

        insumo.setDenominacion(request.denominacion());
        insumo.setPrecioVenta(request.precioVenta());
        insumo.setPrecioCompra(request.precioCompra());
        insumo.setCategoriaArticuloInsumo(categoria);
        insumo.setActivo(request.activo() == null || request.activo());
        insumo.setEsParaElaborar(Boolean.TRUE.equals(request.esParaElaborar()));

        if (request.stockSucursal() != null) {
            Map<Long, SucursalInsumoRequest> stockMap = request.stockSucursal()
                    .stream()
                    .collect(Collectors
                            .toMap(SucursalInsumoRequest::sucursalId, s -> s));

            insumo.getStockSucursal().removeIf(s -> !stockMap.containsKey(s.getSucursal().getId()));

            for (var entry : stockMap.entrySet()) {
                Long sucursalId = entry.getKey();
                var stockReq = entry.getValue();

                var existing = insumo.getStockSucursal().stream()
                        .filter(s -> s.getSucursal().getId().equals(sucursalId))
                        .findFirst()
                        .orElse(null);

                if (existing != null) {
                    existing.setStockActual(resolveStockActual(existing.getStockActual(), stockReq.stockActual()));
                    existing.setStockMinimo(stockReq.stockMinimo());
                    existing.setStockMaximo(stockReq.stockMaximo());
                } else {
                    var sucursal = sucursalRepo.findById(sucursalId)
                            .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));
                    var newStock = new SucursalInsumo();
                    newStock.setSucursal(sucursal);
                    newStock.setInsumo(insumo);
                    newStock.setStockActual(resolveStockActual(null, stockReq.stockActual()));
                    newStock.setStockMinimo(stockReq.stockMinimo());
                    newStock.setStockMaximo(stockReq.stockMaximo());
                    insumo.getStockSucursal().add(newStock);
                }
            }
        }

        insumo.getImagenes().clear();
        if (request.imagen() != null && !request.imagen().isBlank()) {
            ImagenInsumo imagen = new ImagenInsumo();
            imagen.setDenominacion(normalizeInsumoImagePath(request.imagen()));
            imagen.setArticuloInsumo(insumo);
            insumo.getImagenes().add(imagen);
        }
    }


    public ArticuloInsumoResponse toResponse(ArticuloInsumo insumo) {
        CategoriaResponse categoriaDto = getCategoriaResponse(insumo);
        UnidadMedida unidadMedida = insumo.getUnidadMedida();

        UnidadMedidaDTO unidadMedidaDTO = null;
        if (unidadMedida != null) {
            unidadMedidaDTO = new UnidadMedidaDTO(
                    unidadMedida.getId(),
                    unidadMedida.getDenominacion(),
                    unidadMedida.isActivo()
            );
        }


        List<SucursalInsumoRequest> stocks = insumo.getStockSucursal().stream()
                .map(s -> new SucursalInsumoRequest(
                        s.getSucursal().getId(),
                        s.getStockActual(),
                        s.getStockMinimo(),
                        s.getStockMaximo()))
                .toList();

        String imagen = insumo.getImagenes()
                .stream()
                .map(ImagenInsumo::getDenominacion)
                .findFirst()
                .map(this::normalizeInsumoImagePath)
                .orElse(null);

        return new ArticuloInsumoResponse(
                insumo.getId(),
                insumo.getDenominacion(),
                null,
                insumo.getPrecioVenta(),
                insumo.getPrecioCompra(),
                null,
                categoriaDto,
                insumo.getEsParaElaborar(),
                insumo.getActivo(),
                unidadMedidaDTO,
                stocks,
                imagen
        );
    }

    private static CategoriaResponse getCategoriaResponse(ArticuloInsumo insumo) {
        CategoriaArticuloInsumo categoria = insumo.getCategoriaArticuloInsumo() != null
                ? insumo.getCategoriaArticuloInsumo()
                : null;

        CategoriaResponse categoriaDto = null;
        if (insumo.getCategoriaArticuloInsumo() != null) {
            categoriaDto = new CategoriaResponse(
                    categoria.getId(),
                    categoria.getDenominacion(),
                    categoria.getCategoriaPadre() != null ? categoria.getCategoriaPadre().getId() : null,
                    categoria.isActivo()
            );
        }
        return categoriaDto;
    }

    private Double resolveStockActual(Double existingStock, Double requestedStock) {
        if (isAdmin()) {
            return requestedStock != null ? requestedStock : 0.0;
        }
        return existingStock != null ? existingStock : 0.0;
    }

    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }

    private String normalizeInsumoImagePath(String rawPath) {
        if (rawPath == null) {
            return null;
        }
        String path = rawPath.trim();
        if (path.isBlank()) {
            return null;
        }
        if (path.startsWith("data:image/") || path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
            return path;
        }
        return INSUMO_UPLOADS_PREFIX + path;
    }
}
