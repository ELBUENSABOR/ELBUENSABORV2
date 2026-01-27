package com.utn.elbuensabor.dtos;

public record RecetaItemResponse(
        Long insumoId,
        String insumoDenominacion,
        Double cantidad,
        String unidadMedida,
        Double precioCompra,
        Double stockActual
        ) {
}

