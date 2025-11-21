package com.utn.elbuensabor.dtos;

import com.utn.elbuensabor.entities.EstadoPedido;

import jakarta.validation.constraints.NotNull;

public record CambioEstadoDTO(@NotNull
        EstadoPedido estadoPedido) {

}
