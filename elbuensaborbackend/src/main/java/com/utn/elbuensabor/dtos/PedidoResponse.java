package com.utn.elbuensabor.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.utn.elbuensabor.entities.EstadoPedido;
import com.utn.elbuensabor.entities.FormaPago;
import com.utn.elbuensabor.entities.TipoEnvio;

public record PedidoResponse(
        Long id,
        String numero,
        LocalDateTime fechaPedido,
        LocalDateTime horaEstimadaFinalizacion,
        Double subTotal,
        Double descuento,
        Double gastosEnvio,
        Double total,
        Double totalCosto,
        Boolean pagado,
        String observaciones,
        EstadoPedido estado,
        TipoEnvio tipoEnvio,
        FormaPago formaPago,
        ClienteDTO cliente,
        EmpleadoDTO empleado,
        SucursalDTO sucursal,
        List<PedidoDetalleResponse> detalles
) {
    public record ClienteDTO(Long id, String nombre, String apellido, String email) {}
    public record EmpleadoDTO(Long id, String nombre, String apellido) {}
    public record SucursalDTO(Long id, String nombre) {}
    public record PedidoDetalleResponse(
            Long id,
            ArticuloDTO articulo,
            Integer cantidad,
            Double precioUnit,
            Double subTotal
    ) {
        public record ArticuloDTO(Long id, String denominacion, String tipo) {}
    }
}

