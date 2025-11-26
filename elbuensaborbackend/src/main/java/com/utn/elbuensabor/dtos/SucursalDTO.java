package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotBlank;

public record SucursalDTO(
        Long id,
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        @NotBlank(message = "El horario de apertura es obligatorio")
        String horarioApertura,
        @NotBlank(message = "El horario de cierre es obligatorio")
        String horarioCierre) {
}

