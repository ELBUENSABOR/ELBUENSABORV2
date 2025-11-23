package com.utn.elbuensabor.services;


import com.utn.elbuensabor.entities.PedidoVenta;

import java.util.List;

public interface StockService {

    List<String> verificarStockDisponible(PedidoVenta pedido);
    void decrementarStock(PedidoVenta pedido);
    boolean verificarStockArticuloManufacturado(Long manufacturadoId, Integer cantidad, Long sucursalId);
    boolean verificarStockInsumo(Long insumoId, Integer cantidad, Long sucursalId);
    Double obtenerStockActual(Long insumoId, Long sucursalId);
}

