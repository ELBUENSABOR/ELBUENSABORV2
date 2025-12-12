package com.utn.elbuensabor.services.impl;

import java.util.List;

import com.utn.elbuensabor.dtos.*;
import com.utn.elbuensabor.entities.ImagenArticuloManufacturado;
import com.utn.elbuensabor.services.ArticuloManufacturadoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.entities.ArticuloInsumo;
import com.utn.elbuensabor.entities.ArticuloManufacturado;
import com.utn.elbuensabor.entities.ArticuloManufacturadoDetalle;
import com.utn.elbuensabor.entities.CategoriaArticuloManufacturado;
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

        public List<ArticuloManufacturadoResponse> getAll() {
                return manufacturadoRepo.findAll().stream()
                                .map(this::toResponse)
                                .toList();
        }

        public ArticuloManufacturadoResponse getById(Long id) {
                ArticuloManufacturado manufacturado = manufacturadoRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                return toResponse(manufacturado);
        }

        @Transactional
        public ArticuloManufacturadoResponse create(ArticuloManufacturadoRequest request) {
                ArticuloManufacturado manufacturado = new ArticuloManufacturado();
                fillFromRequest(manufacturado, request);
                manufacturadoRepo.save(manufacturado);
                return toResponse(manufacturado);
        }

        @Transactional
        public ArticuloManufacturadoResponse update(Long id, ArticuloManufacturadoRequest request) {
                ArticuloManufacturado manufacturado = manufacturadoRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                manufacturado.getArticuloManufacturadoDetalles().clear();
                fillFromRequest(manufacturado, request);
                manufacturadoRepo.save(manufacturado);
                return toResponse(manufacturado);
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
                manufacturado.setPrecioVenta(request.precioVenta());
                manufacturado.setPrecioCosto(request.precioCosto());
                manufacturado.setTiempoEstimado(request.tiempoEstimado());
                manufacturado.setCategoria(categoria);
                manufacturado.setActivo(true);

                // Manejar receta
                List<ArticuloManufacturadoDetalle> detalles = request.receta().stream()
                                .map(this::toDetalle)
                                .toList();
                detalles.forEach(detalle -> detalle.setArticuloManufacturado(manufacturado));
                manufacturado.setArticuloManufacturadoDetalles(detalles);

                // Manejar imágenes
                manufacturado.getImagenes().clear();
                if (request.imagenes() != null && !request.imagenes().isEmpty()) {
                        List<ImagenArticuloManufacturado> imagenes = request.imagenes().stream()
                                        .map(url -> {
                                                ImagenArticuloManufacturado imagen = new ImagenArticuloManufacturado();
                                                imagen.setDenominacion(url);
                                                imagen.setArticuloManufacturado(manufacturado);
                                                return imagen;
                                        })
                                        .toList();
                        manufacturado.getImagenes().addAll(imagenes);
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

        public ArticuloManufacturadoResponse toResponse(ArticuloManufacturado manufacturado) {
                Long categoriaId = (manufacturado.getCategoria() != null)
                                ? manufacturado.getCategoria().getId()
                                : null;

                String categoria = (manufacturado.getCategoria() != null)
                                ? manufacturado.getCategoria().getDenominacion()
                                : null;

                List<RecetaItemResponse> receta = manufacturado.getArticuloManufacturadoDetalles()
                                .stream()
                                .map(det -> new RecetaItemResponse(
                                                det.getArticuloInsumo().getId(),
                                                det.getArticuloInsumo().getDenominacion(),
                                                det.getCantidad()))
                                .toList();

                List<String> imagenes = manufacturado.getImagenes()
                                .stream()
                                .map(img -> img.getDenominacion())
                                .toList();

                return new ArticuloManufacturadoResponse(
                                manufacturado.getId(),
                                manufacturado.getDenominacion(),
                                manufacturado.getDescripcion(),
                                manufacturado.getPrecioVenta(),
                                manufacturado.getPrecioCosto(),
                                manufacturado.getTiempoEstimado(),
                                categoriaId,
                                categoria,
                                manufacturado.getActivo(),
                                receta,
                                imagenes);
        }
}
