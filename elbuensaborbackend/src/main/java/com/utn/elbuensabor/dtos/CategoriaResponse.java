package com.utn.elbuensabor.dtos;

public record CategoriaResponse(
        Long id,
        String denominacion,
        Long categoriaPadreId,
        boolean activo
) {
}

