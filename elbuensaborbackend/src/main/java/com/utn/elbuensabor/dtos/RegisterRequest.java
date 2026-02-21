package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        String username,
        @Email
        @NotBlank
        String email,
        @NotBlank
        @Size(min = 8)
        String password,
        @NotBlank
        String nombre,
        @NotBlank
        String apellido,
        @NotBlank
        String telefono,
        @NotBlank
        String calle,
        @NotNull
        Integer codigoPostal,
        @NotNull
        Long localidad,
        @NotBlank
        String numero
        ) {

}
