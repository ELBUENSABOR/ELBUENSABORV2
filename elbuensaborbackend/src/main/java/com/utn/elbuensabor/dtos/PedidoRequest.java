package com.utn.elbuensabor.dtos;

import com.utn.elbuensabor.entities.FormaPago;
import com.utn.elbuensabor.entities.TipoEnvio;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PedidoRequest(
        @NotNull(message = "El cliente es obligatorio")
        Long clienteId,

        @NotNull(message = "La sucursal es obligatoria")
        Long sucursalId,

        @NotNull(message = "El tipo de envío es obligatorio")
        TipoEnvio tipoEnvio,

        @NotNull(message = "La forma de pago es obligatoria")
        FormaPago formaPago,

        @NotEmpty(message = "El pedido debe tener al menos un detalle")
        @Valid
        List<PedidoDetalleDTO> detalles,

        Double descuento,
        String observaciones,
        String direccionEntrega,
        String telefonoEntrega
) {
}

