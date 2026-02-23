package com.utn.elbuensabor.services;

import com.utn.elbuensabor.entities.NotaCredito;

public interface NotaCreditoService {
    NotaCredito emitirDesdeFactura(Long facturaId);
}
