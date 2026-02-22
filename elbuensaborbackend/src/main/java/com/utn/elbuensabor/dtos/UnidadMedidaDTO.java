package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotBlank;

public record UnidadMedidaDTO(
        Long id,
        @NotBlank(message = "La denominacion es obligatoria") String denominacion,
        boolean activo
) {
}
