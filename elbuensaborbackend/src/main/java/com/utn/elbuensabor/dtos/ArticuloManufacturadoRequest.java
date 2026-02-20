package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ArticuloManufacturadoRequest(
        @NotNull Long sucursalId,
        @NotBlank String denominacion,
        String descripcion,
        String receta,
        @NotNull Double precioVenta,
        Double precioCosto,
        @NotNull Integer tiempoEstimado,
        @NotNull Long categoriaId,
        @NotNull List<RecetaItemRequest> ingredientes,
        List<String> imagenes,
        Boolean activo
) {
}