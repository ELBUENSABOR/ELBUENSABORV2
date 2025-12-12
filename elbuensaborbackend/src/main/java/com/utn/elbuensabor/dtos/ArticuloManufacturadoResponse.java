package com.utn.elbuensabor.dtos;

import java.util.List;

public record ArticuloManufacturadoResponse(Long id,
        String denominacion,
        String descripcion,
        Double precioVenta,
        Double precioCosto,
        Integer tiempoEstimado,
        Long categoriaId,
        String categoria,
        Boolean activo,
        List<RecetaItemResponse> receta,
        List<String> imagenes) {
}
