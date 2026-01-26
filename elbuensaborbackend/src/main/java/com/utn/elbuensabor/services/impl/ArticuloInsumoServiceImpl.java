package com.utn.elbuensabor.services.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.utn.elbuensabor.dtos.*;
import com.utn.elbuensabor.entities.ImagenInsumo;
import com.utn.elbuensabor.entities.SucursalInsumo;
import com.utn.elbuensabor.entities.UnidadMedida;
import com.utn.elbuensabor.services.ArticuloInsumoService;
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
                    existing.setStockActual(stockReq.stockActual());
                    existing.setStockMinimo(stockReq.stockMinimo());
                    existing.setStockMaximo(stockReq.stockMaximo());
                } else {
                    var sucursal = sucursalRepo.findById(sucursalId)
                            .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));
                    var newStock = new SucursalInsumo();
                    newStock.setSucursal(sucursal);
                    newStock.setInsumo(insumo);
                    newStock.setStockActual(stockReq.stockActual());
                    newStock.setStockMinimo(stockReq.stockMinimo());
                    newStock.setStockMaximo(stockReq.stockMaximo());
                    insumo.getStockSucursal().add(newStock);
                }
            }
        }

        insumo.getImagenes().clear();
        if (request.imagenes() != null && !request.imagenes().isEmpty()) {
            List<ImagenInsumo> imagenes = request.imagenes().stream()
                    .map(url -> {
                        ImagenInsumo imagen = new ImagenInsumo();
                        imagen.setDenominacion(url);
                        imagen.setArticuloInsumo(insumo);
                        return imagen;
                    })
                    .toList();
            insumo.getImagenes().addAll(imagenes);
        }
    }


    public ArticuloInsumoResponse toResponse(ArticuloInsumo insumo) {
        CategoriaResponse categoriaDto = getCategoriaResponse(insumo);
        UnidadMedida unidadMedida = insumo.getUnidadMedida();

        UnidadMedidaDTO unidadMedidaDTO = null;
        if (unidadMedida != null) {
            unidadMedidaDTO = new UnidadMedidaDTO(
                    unidadMedida.getId(),
                    unidadMedida.getDenominacion()
            );
        }


        List<SucursalInsumoRequest> stocks = insumo.getStockSucursal().stream()
                .map(s -> new SucursalInsumoRequest(
                        s.getSucursal().getId(),
                        s.getStockActual(),
                        s.getStockMinimo(),
                        s.getStockMaximo()))
                .toList();

        List<String> imagenes = insumo.getImagenes()
                .stream()
                .map(ImagenInsumo::getDenominacion)
                .toList();

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
                imagenes);
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
}
