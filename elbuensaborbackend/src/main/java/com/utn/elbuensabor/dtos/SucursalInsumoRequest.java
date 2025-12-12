package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotNull;

public record SucursalInsumoRequest(
        @NotNull Long sucursalId,
        Double stockActual,
        Double stockMinimo,
        Double stockMaximo) {
}
