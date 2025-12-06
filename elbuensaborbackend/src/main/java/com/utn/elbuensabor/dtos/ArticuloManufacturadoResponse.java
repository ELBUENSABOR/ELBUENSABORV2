package com.utn.elbuensabor.dtos;

import com.utn.elbuensabor.entities.ArticuloInsumo;

import java.util.List;

public record ArticuloManufacturadoResponse(Long id,
                                            String denominacion,
                                            String descripcion,
                                            Double precioVenta,
                                            Double precioCosto,
                                            Integer tiempoEstimado,
                                            String categoria,
                                            Boolean activo,
                                            List<RecetaItemResponse> receta) {
}
