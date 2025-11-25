package com.utn.elbuensabor.services;

import java.time.LocalDateTime;
import java.util.List;

import com.utn.elbuensabor.dtos.PedidoRequest;
import com.utn.elbuensabor.dtos.PedidoResponse;
import com.utn.elbuensabor.entities.EstadoPedido;
import com.utn.elbuensabor.entities.PedidoVenta;

public interface PedidoService {


    PedidoResponse create(PedidoRequest request);

    PedidoResponse getById(Long id);

    List<PedidoResponse> getAll();

    List<PedidoResponse> getByClienteId(Long clienteId);

    List<PedidoResponse> getByEstado(EstadoPedido estado);

    List<PedidoResponse> getBySucursalId(Long sucursalId);

    PedidoResponse update(Long id, PedidoRequest request);

    void delete(Long id);

    PedidoResponse cambiarEstado(Long id, EstadoPedido nuevoEstado);

    String generarNumeroPedido();

    Double calcularGastosEnvio();

    LocalDateTime calcularHoraEstimadaFinalizacion(PedidoVenta pedido);

    boolean esTransicionValida(EstadoPedido estadoActual, EstadoPedido nuevoEstado);

    PedidoResponse mapToResponse(PedidoVenta pedido);
}

