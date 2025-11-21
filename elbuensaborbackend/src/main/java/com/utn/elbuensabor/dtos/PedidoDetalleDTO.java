package com.utn.elbuensabor.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PedidoDetalleDTO(
        Long manufacturadoId,
        Long insumoId,
        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad debe ser mayor a 0")
        Integer cantidad
) {
    // Validación: debe tener manufacturadoId o insumoId, pero no ambos
    public boolean isValid() {
        return (manufacturadoId != null && insumoId == null) || 
               (manufacturadoId == null && insumoId != null);
    }
}

