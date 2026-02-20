package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotBlank;

// DTO para cambiar contraseña
public record ChangePasswordRequest(
        @NotBlank String oldPassword,
        @NotBlank String newPassword
) { }
