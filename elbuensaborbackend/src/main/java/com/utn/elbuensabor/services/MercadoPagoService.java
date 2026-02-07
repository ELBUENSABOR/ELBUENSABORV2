package com.utn.elbuensabor.services;

import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.utn.elbuensabor.entities.PedidoVenta;

public interface MercadoPagoService {
    public String crearPreference(PedidoVenta pedido) throws MPException, MPApiException;
}