package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequest(
        @NotBlank(message = "El nombre del rubro es obligatorio")
        String denominacion,
        Long categoriaPadreId,
        boolean activo
) {

}

