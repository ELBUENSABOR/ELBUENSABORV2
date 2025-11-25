package com.utn.elbuensabor.dtos;

import java.util.List;

public record ArticuloResponse(
        Long id,
        String denominacion,
        String descripcion,
        Double precioVenta,
        Double precioCosto,
        Integer tiempoEstimado,
        String categoria,
        Boolean esParaElaborar,
        Boolean activo,
        List<RecetaItemResponse> receta) {
}

