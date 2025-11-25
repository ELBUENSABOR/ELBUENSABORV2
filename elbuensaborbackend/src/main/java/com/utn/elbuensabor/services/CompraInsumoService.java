package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.RegistroCompraRequest;

public interface CompraInsumoService {

    public void registrarCompra(Long insumoId, RegistroCompraRequest request);
}

