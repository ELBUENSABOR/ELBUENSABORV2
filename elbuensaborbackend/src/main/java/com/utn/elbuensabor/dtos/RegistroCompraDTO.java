package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record RegistroCompraDTO(
        Long id,
        @NotNull SucursalDTO sucursal,
        @NotNull ArticuloInsumoResponse insumo,
        @NotNull @Min(1) Double cantidad,
        LocalDateTime fechaCompra,
        Double precioCompra,
        Double totalCompra
) {

}
