package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequest(
        @NotBlank
        String denominacion,
        Long categoriaPadreId) {

}

