package com.utn.elbuensabor.dtos;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ArticuloManufacturadoRequest(
        @NotBlank String denominacion,
        String descripcion,
        @NotNull Double precioVenta,
        Double precioCosto,
        @NotNull Integer tiempoEstimado,
        @NotNull Long categoriaId,
        @NotNull List<RecetaItemRequest> receta) {
}

