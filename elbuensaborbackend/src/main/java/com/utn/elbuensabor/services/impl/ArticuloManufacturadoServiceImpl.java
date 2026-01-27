package com.utn.elbuensabor.services.impl;

import java.util.List;

import com.utn.elbuensabor.dtos.*;
import com.utn.elbuensabor.entities.*;
import com.utn.elbuensabor.services.ArticuloManufacturadoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.repositories.ArticuloInsumoRepository;
import com.utn.elbuensabor.repositories.ArticuloManufacturadoRepository;
import com.utn.elbuensabor.repositories.CategoriaArticuloManufacturadoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticuloManufacturadoServiceImpl implements ArticuloManufacturadoService {

        private final ArticuloManufacturadoRepository manufacturadoRepo;
        private final CategoriaArticuloManufacturadoRepository categoriaRepo;
        private final ArticuloInsumoRepository insumoRepo;

    public List<ArticuloManufacturadoResponse> getAllBySucursal(Long sucursalId) {
        return manufacturadoRepo.findAll().stream()
                .map(m -> toResponse(m, sucursalId))
                .toList();
    }

    public ArticuloManufacturadoResponse getByIdBySucursal(Long id, Long sucursalId) {
        ArticuloManufacturado m = manufacturadoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return toResponse(m, sucursalId);
    }

    @Transactional
    public ArticuloManufacturadoResponse create(ArticuloManufacturadoRequest request) {
        ArticuloManufacturado manufacturado = new ArticuloManufacturado();
        fillFromRequest(manufacturado, request);
        manufacturadoRepo.save(manufacturado);
        return toResponseBase(manufacturado);
    }

    @Transactional
    public ArticuloManufacturadoResponse update(Long id, ArticuloManufacturadoRequest request) {
        ArticuloManufacturado manufacturado = manufacturadoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        fillFromRequest(manufacturado, request);
        return toResponseBase(manufacturado);
    }



    public void delete(Long id) {
                ArticuloManufacturado manufacturado = manufacturadoRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                manufacturado.setActivo(false);
                manufacturadoRepo.save(manufacturado);
        }

    public void fillFromRequest(ArticuloManufacturado manufacturado, ArticuloManufacturadoRequest request) {

        CategoriaArticuloManufacturado categoria = categoriaRepo.findById(request.categoriaId())
                .orElseThrow(() -> new RuntimeException("Rubro de producto no encontrado"));

        manufacturado.setDenominacion(request.denominacion());
        manufacturado.setDescripcion(request.descripcion());
        manufacturado.setReceta(request.receta());
        manufacturado.setPrecioVenta(request.precioVenta());
        manufacturado.setPrecioCosto(request.precioCosto());
        manufacturado.setTiempoEstimado(request.tiempoEstimado());
        manufacturado.setCategoria(categoria);
        manufacturado.setActivo(request.activo() != null ? request.activo() : true);

    /* ===============================
       RECETA (INGREDIENTES)
       =============================== */

        manufacturado.getArticuloManufacturadoDetalles().clear();

        for (RecetaItemRequest item : request.ingredientes()) {
            ArticuloManufacturadoDetalle detalle = toDetalle(item);
            detalle.setArticuloManufacturado(manufacturado);
            manufacturado.getArticuloManufacturadoDetalles().add(detalle);
        }

    /* ===============================
       IMÁGENES
       =============================== */

        manufacturado.getImagenes().clear();

        if (request.imagenes() != null) {
            for (String url : request.imagenes()) {
                ImagenArticuloManufacturado imagen = new ImagenArticuloManufacturado();
                imagen.setDenominacion(url);
                imagen.setArticuloManufacturado(manufacturado);
                manufacturado.getImagenes().add(imagen);
            }
        }
    }


    public ArticuloManufacturadoDetalle toDetalle(RecetaItemRequest item) {
                ArticuloInsumo insumo = insumoRepo.findById(item.insumoId())
                                .orElseThrow(() -> new RuntimeException("Insumo de la receta no encontrado"));
                ArticuloManufacturadoDetalle detalle = new ArticuloManufacturadoDetalle();
                detalle.setArticuloInsumo(insumo);
                detalle.setCantidad(item.cantidad());
                return detalle;
        }

    public ArticuloManufacturadoResponse toResponseBase(ArticuloManufacturado manufacturado) {

        return new ArticuloManufacturadoResponse(
                manufacturado.getId(),
                manufacturado.getDenominacion(),
                manufacturado.getDescripcion(),
                manufacturado.getReceta(),
                manufacturado.getPrecioVenta(),
                manufacturado.getPrecioCosto(),
                manufacturado.getTiempoEstimado(),
                manufacturado.getCategoria().getId(),
                manufacturado.getCategoria().getDenominacion(),
                manufacturado.getActivo(),
                manufacturado.getArticuloManufacturadoDetalles().stream()
                        .map(det -> new RecetaItemResponse(
                                det.getArticuloInsumo().getId(),
                                det.getArticuloInsumo().getDenominacion(),
                                det.getCantidad(),
                                det.getArticuloInsumo().getUnidadMedida().getDenominacion(),
                                det.getArticuloInsumo().getPrecioCompra(),
                                null // stock no aplica acá
                        ))
                        .toList(),
                manufacturado.getImagenes().stream()
                        .map(ImagenArticuloManufacturado::getDenominacion)
                        .toList(),
                true // disponibilidad no se evalúa acá
        );
    }


    public ArticuloManufacturadoResponse toResponse(
            ArticuloManufacturado manufacturado,
            Long sucursalId
    ) {

        List<RecetaItemResponse> ingredientes = manufacturado
                .getArticuloManufacturadoDetalles()
                .stream()
                .map(det -> {

                    ArticuloInsumo insumo = det.getArticuloInsumo();

                    Double stockActual = insumo.getStockSucursal().stream()
                            .filter(s -> s.getSucursal().getId().equals(sucursalId))
                            .map(SucursalInsumo::getStockActual)
                            .findFirst()
                            .orElse(0.0);

                    return new RecetaItemResponse(
                            insumo.getId(),
                            insumo.getDenominacion(),
                            det.getCantidad(),
                            insumo.getUnidadMedida().getDenominacion(),
                            insumo.getPrecioCompra(),
                            stockActual
                    );
                })
                .toList();

        // ✅ DISPONIBILIDAD (CLARA Y SEGURA)
        boolean disponible = ingredientes.stream()
                .allMatch(i -> i.stockActual() >= i.cantidad());

        return new ArticuloManufacturadoResponse(
                manufacturado.getId(),
                manufacturado.getDenominacion(),
                manufacturado.getDescripcion(),
                manufacturado.getReceta(),
                manufacturado.getPrecioVenta(),
                manufacturado.getPrecioCosto(),
                manufacturado.getTiempoEstimado(),
                manufacturado.getCategoria().getId(),
                manufacturado.getCategoria().getDenominacion(),
                manufacturado.getActivo(),
                ingredientes,
                manufacturado.getImagenes().stream()
                        .map(ImagenArticuloManufacturado::getDenominacion)
                        .toList(),
                disponible
        );
    }
}
