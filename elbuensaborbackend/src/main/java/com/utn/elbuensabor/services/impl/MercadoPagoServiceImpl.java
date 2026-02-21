package com.utn.elbuensabor.services.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferencePayerRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.services.MercadoPagoService;

@Service
public class MercadoPagoServiceImpl implements MercadoPagoService {

    @Value("${mercadopago.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Value("${mercadopago.webhook-url:http://localhost:8080/api/pagos/mercadopago/webhook}")
    private String webhookUrl;

    @Override
    public String crearPreference(PedidoVenta pedido) throws MPException, MPApiException {

        String baseUrl = sanitizeUrl(frontendBaseUrl, "mercadopago.frontend-base-url");
        String notifUrl = sanitizeUrl(webhookUrl, "mercadopago.webhook-url");

        List<PreferenceItemRequest> items = pedido.getDetalles().stream()
                .map(det -> {
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

        // IMPORTANTE: agrego un flag ?mp=1 para que el front sepa que volvió del checkout
        String pedidoUrl = String.format("%s/pedido/%d?mp=1", baseUrl, pedido.getId());

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success(pedidoUrl)
                .failure(pedidoUrl)
                .pending(pedidoUrl)
                .build();

        PreferencePayerRequest payer = PreferencePayerRequest.builder()
                .email(pedido.getCliente().getEmail())
                .build();

        PreferenceRequest request = PreferenceRequest.builder()
                .items(items)
                .payer(payer)
                .externalReference(String.valueOf(pedido.getId())) // clave para mapear pedido en webhook
                .backUrls(backUrls)
                .notificationUrl(notifUrl) // debe apuntar al NGROK del BACKEND
                .autoReturn("approved") // siempre, sandbox y prod
                .binaryMode(true) // opcional: reduce estados "intermedios"
                .build();

        Preference preference = new PreferenceClient().create(request);

        // Sandbox: preferí sandbox_init_point si viene
        String sandboxInit = preference.getSandboxInitPoint();
        if (sandboxInit != null && !sandboxInit.isBlank()) {
            return sandboxInit;
        }

        String initPoint = preference.getInitPoint();
        if (initPoint == null || initPoint.isBlank()) {
            throw new IllegalStateException("Mercado Pago no devolvió init_point");
        }
        return initPoint;
    }

    private String sanitizeUrl(String raw, String propName) {
        String url = raw != null ? raw.trim() : "";
        if (url.isEmpty()) {
            throw new IllegalStateException(propName + " no puede estar vacío");
        }
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            throw new IllegalStateException(propName + " debe iniciar con http:// o https://");
        }
        if (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }
        return url;
    }
}
