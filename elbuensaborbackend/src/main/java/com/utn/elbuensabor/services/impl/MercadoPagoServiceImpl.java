package com.utn.elbuensabor.services.impl;

import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.services.MercadoPagoService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MercadoPagoServiceImpl implements MercadoPagoService {

    @Value("${mercadopago.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;
    @Value("${mercadopago.webhook-url:http://localhost:8080/api/pagos/mercadopago/webhook}")
    private String webhookUrl;

    @Override
    public String crearPreference(PedidoVenta pedido) throws MPException, MPApiException {

        String baseUrl = frontendBaseUrl != null ? frontendBaseUrl.trim() : "";
        if (baseUrl.isEmpty()) {
            throw new IllegalStateException("mercadopago.frontend-base-url no puede estar vacío");
        }
        if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
            throw new IllegalStateException("mercadopago.frontend-base-url debe iniciar con http:// o https://");
        }
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
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
        String pedidoUrl = String.format("%s/pedido/%d", baseUrl, pedido.getId());

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success(pedidoUrl)
                .failure(pedidoUrl)
                .pending(pedidoUrl)
                .build();

        PreferencePayerRequest payer = PreferencePayerRequest.builder()
                .email(pedido.getCliente().getEmail())
                .build();

        PreferenceRequest.PreferenceRequestBuilder requestBuilder = PreferenceRequest.builder()
                .items(items)
                .payer(payer)
                .externalReference(pedido.getId().toString()) // 🔑 clave
                .backUrls(backUrls)
                .notificationUrl(webhookUrl)
                .binaryMode(true);

        if (baseUrl.startsWith("https://")) {
            requestBuilder.autoReturn("approved");
        }

        PreferenceRequest request = requestBuilder.build();

        Preference preference = new PreferenceClient().create(request);
        return preference.getInitPoint();
    }
}