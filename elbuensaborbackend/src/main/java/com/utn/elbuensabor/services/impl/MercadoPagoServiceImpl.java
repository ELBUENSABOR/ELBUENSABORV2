package com.utn.elbuensabor.services.impl;

import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.services.MercadoPagoService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MercadoPagoServiceImpl implements MercadoPagoService {
    @Override
    public String crearPreference(PedidoVenta pedido) throws MPException, MPApiException {

        List<PreferenceItemRequest> items = pedido.getDetalles().stream()
                .map(det -> {
                    System.out.println("Item detalle" + det.getCantidad() + "," + det.getPrecioUnit() + "," + det.getManufacturado().getDenominacion());
                    String titulo = det.getManufacturado() != null
                            ? det.getManufacturado().getDenominacion()
                            : det.getInsumo().getDenominacion();

                    return PreferenceItemRequest.builder()
                            .title(titulo)
                            .quantity(det.getCantidad())
                            .unitPrice(BigDecimal.valueOf(det.getPrecioUnit()))
                            .currencyId("ARS")
                            .build();
                })
                .toList();

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("http://localhost:5173/pedido/" + pedido.getId())
                .failure("http://localhost:5173/pedido/" + pedido.getId())
                .pending("http://localhost:5173/pedido/" + pedido.getId())
                .build();

        PreferencePayerRequest payer = PreferencePayerRequest.builder()
                .email(pedido.getCliente().getEmail())
                .build();

        PreferenceRequest request = PreferenceRequest.builder()
                .items(items)
                .payer(payer)
                .externalReference(pedido.getId().toString()) // 🔑 clave
                .backUrls(backUrls)
                .autoReturn("approved")
                .binaryMode(true)
                .build();

        Preference preference = new PreferenceClient().create(request);
        return preference.getInitPoint();
    }
}