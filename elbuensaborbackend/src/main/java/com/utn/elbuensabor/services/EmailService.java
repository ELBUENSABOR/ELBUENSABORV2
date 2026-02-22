package com.utn.elbuensabor.services;

import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.entities.NotaCreditoVenta;

public interface EmailService {
    void enviarFactura(FacturaVenta factura);
    void enviarNotaCredito(NotaCreditoVenta notaCredito);
}