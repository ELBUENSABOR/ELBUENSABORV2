package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotBlank;

public record CategoriaResponse(
        Long id,
        String denominacion,
        Long categoriaPadreId,
        boolean activo
        ) {
}

