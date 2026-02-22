package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.dtos.StockAlertaDTO;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.entities.SucursalInsumo;


public interface StockService {

    List<String> verificarStockDisponible(PedidoVenta pedido);

    void decrementarStock(PedidoVenta pedido);

    void incrementarStock(PedidoVenta pedido);

    boolean verificarStockArticuloManufacturado(Long manufacturadoId, Integer cantidad, Long sucursalId);

    boolean verificarStockInsumo(Long insumoId, Integer cantidad, Long sucursalId);

    Double obtenerStockActual(Long insumoId, Long sucursalId);

    List<StockAlertaDTO> obtenerAlertas(Long sucursalId);

    StockAlertaDTO toAlerta(SucursalInsumo sucursalInsumo, String nivel);
}

