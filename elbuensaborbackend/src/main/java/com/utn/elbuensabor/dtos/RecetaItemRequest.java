package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotNull;

public record RecetaItemRequest(
        @NotNull Long insumoId,
        @NotNull Double cantidad) {
}

