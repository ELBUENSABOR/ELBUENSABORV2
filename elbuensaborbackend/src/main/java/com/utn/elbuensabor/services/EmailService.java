package com.utn.elbuensabor.services;

import com.utn.elbuensabor.entities.FacturaVenta;

public interface EmailService {
    void enviarFactura(FacturaVenta factura);
}