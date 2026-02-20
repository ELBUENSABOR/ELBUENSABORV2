package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ArticuloInsumoRequest(
        @NotBlank String denominacion,
        @NotNull Double precioVenta,
        Double precioCompra,
        @NotNull Long categoriaId,
        Boolean activo,
        Boolean esParaElaborar,
        Long unidadMedidaId,
        List<SucursalInsumoRequest> stockSucursal,
        List<String> imagenes) {
}
