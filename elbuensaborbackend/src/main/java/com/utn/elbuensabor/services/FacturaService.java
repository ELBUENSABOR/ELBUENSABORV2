package com.utn.elbuensabor.services;

import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.entities.PedidoVenta;

public interface FacturaService {
    FacturaVenta generarFactura(PedidoVenta pedido);
}