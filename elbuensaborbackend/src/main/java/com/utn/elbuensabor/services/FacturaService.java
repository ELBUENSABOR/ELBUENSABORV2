package com.utn.elbuensabor.services;

import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.entities.NotaCreditoVenta;
import com.utn.elbuensabor.entities.PedidoVenta;

public interface FacturaService {
    FacturaVenta generarFactura(PedidoVenta pedido);
    String generarPdfNotaCredito(NotaCreditoVenta notaCredito);
}