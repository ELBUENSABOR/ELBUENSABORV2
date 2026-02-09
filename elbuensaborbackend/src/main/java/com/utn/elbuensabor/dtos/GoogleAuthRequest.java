package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotBlank;

public record GoogleAuthRequest(
        @NotBlank
        String credential
) {
}
