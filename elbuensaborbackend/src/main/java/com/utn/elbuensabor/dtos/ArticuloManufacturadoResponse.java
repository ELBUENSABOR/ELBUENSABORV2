package com.utn.elbuensabor.dtos;

import java.util.List;

public record ArticuloManufacturadoResponse(Long id,
                                            String denominacion,
                                            String descripcion,
                                            String receta,
                                            Double precioVenta,
                                            Double precioCosto,
                                            Integer tiempoEstimado,
                                            Long categoriaId,
                                            String categoria,
                                            Boolean activo,
                                            List<RecetaItemResponse> ingredientes,
                                            String imagen,
                                            Boolean disponible
) {

}