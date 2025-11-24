package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RegistroCompraRequest(
        @NotNull Long sucursalId,
        @NotNull @Min(1) Integer cantidad,
        Double precioCompra) {

}

