package com.utn.elbuensabor.dtos;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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
