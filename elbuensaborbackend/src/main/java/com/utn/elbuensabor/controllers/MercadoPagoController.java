package com.utn.elbuensabor.controllers;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.utn.elbuensabor.entities.DatosMercadoPago;
import com.utn.elbuensabor.entities.FormaPago;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.repositories.DatosMercadoPagoRepository;
import com.utn.elbuensabor.repositories.PedidoVentaRepository;
import com.utn.elbuensabor.services.EmailService;
import com.utn.elbuensabor.services.FacturaService;
import com.utn.elbuensabor.services.MercadoPagoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class MercadoPagoController {

    private final PedidoVentaRepository pedidoRepository;
    private final DatosMercadoPagoRepository datosMercadoPagoRepository;
    private final MercadoPagoService mpService;
    private final FacturaService facturaService;
    private final EmailService emailService;

    @PostMapping("/mercadopago/{pedidoId}")
    public ResponseEntity<?> crearPago(@PathVariable Long pedidoId) {

        PedidoVenta pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (pedido.getFormaPago() != FormaPago.MP) {
            return ResponseEntity.badRequest().build();
        }

        try {
            String initPoint = mpService.crearPreference(pedido);
            return ResponseEntity.ok(Map.of("initPoint", initPoint));
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", ex.getMessage()
            ));
        } catch (MPApiException ex) {
            String apiContent = ex.getApiResponse() != null ? ex.getApiResponse().getContent() : null;
            boolean unauthorized = ex.getStatusCode() == 401
                    || ex.getStatusCode() == 403
                    || (apiContent != null && apiContent.contains("MP-UNAUTHORIZED"));
            return ResponseEntity.status(502).body(Map.of(
                    "message", unauthorized
                            ? "Credenciales de Mercado Pago inválidas. Verificá MERCADOPAGO_ACCESS_TOKEN."
                            : "Error al crear la preferencia en Mercado Pago",
                    "status", ex.getStatusCode(),
                    "error", apiContent
            ));
        } catch (MPException ex) {
            return ResponseEntity.status(502).body(Map.of(
                    "message", "Error al crear la preferencia en Mercado Pago",
                    "error", ex.getMessage()
            ));
        }
    }

    @PostMapping("/mercadopago/webhook")
    public ResponseEntity<Void> webhook(
            @RequestBody(required = false) Map<String, Object> payload,
            @RequestParam Map<String, String> queryParams
    ) {

        String paymentId = extractPaymentId(payload, queryParams);
        if (paymentId == null) {
            return ResponseEntity.ok().build();
        }

        try {
            Payment payment = new PaymentClient().get(Long.valueOf(paymentId));
            String externalReference = payment.getExternalReference();
            if (externalReference == null) {
                return ResponseEntity.ok().build();
            }

            Long pedidoId = Long.valueOf(externalReference);
            PedidoVenta pedido = pedidoRepository.findByIdWithDetalles(pedidoId)
                    .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

            syncPaymentAndPedido(pedido, payment);
        } catch (Exception ex) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/mercadopago/verificar/{pedidoId}")
    public ResponseEntity<?> verificarPago(
            @PathVariable Long pedidoId,
            @RequestParam(required = false) String paymentId
    ) {

        PedidoVenta pedido = pedidoRepository.findByIdWithDetalles(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        String paymentIdToVerify = paymentId;
        if (paymentIdToVerify == null || paymentIdToVerify.isBlank()) {
            paymentIdToVerify = datosMercadoPagoRepository.findByPedidoId(pedidoId)
                    .map(datos -> datos.getPaymentId())
                    .orElse(null);
        }

        if (paymentIdToVerify == null || paymentIdToVerify.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Pago no encontrado"
            ));
        }

        try {
            Payment payment = new PaymentClient().get(Long.valueOf(paymentIdToVerify));

            String externalReference = payment.getExternalReference();
            if (externalReference == null || !externalReference.equals(String.valueOf(pedidoId))) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "El pago no corresponde al pedido"
                ));
            }

            syncPaymentAndPedido(pedido, payment);

            return ResponseEntity.ok(Map.of(
                    "status", payment.getStatus(),
                    "paymentId", payment.getId()
            ));

        } catch (MPApiException e) {
            System.err.println("MP API error: "
                    + (e.getApiResponse() != null ? e.getApiResponse().getContent() : e.getMessage()));

            return ResponseEntity.status(502).body(Map.of(
                    "error", "Mercado Pago API error"
            ));

        } catch (MPException e) {
            System.err.println("MP SDK error: " + e.getMessage());

            return ResponseEntity.status(500).body(Map.of(
                    "error", "Mercado Pago SDK error"
            ));
        }
    }

    private LocalDateTime toLocalDateTime(OffsetDateTime dateTime) {
        return dateTime != null ? dateTime.toLocalDateTime() : null;
    }

    private void syncPaymentAndPedido(PedidoVenta pedido, Payment payment) {
        DatosMercadoPago datos = datosMercadoPagoRepository.findByPedidoId(pedido.getId())
                .orElseGet(DatosMercadoPago::new);

        datos.setPedido(pedido);
        datos.setPaymentId(String.valueOf(payment.getId()));
        datos.setPaymentTypeId(payment.getPaymentTypeId());
        datos.setPaymentMethodId(payment.getPaymentMethodId());
        datos.setStatus(payment.getStatus());
        datos.setStatusDetail(payment.getStatusDetail());
        datos.setDateCreated(toLocalDateTime(payment.getDateCreated()));
        datos.setDateApproved(toLocalDateTime(payment.getDateApproved()));
        datos.setDateLastUpdated(toLocalDateTime(payment.getDateLastUpdated()));
        datosMercadoPagoRepository.save(datos);

        if ("approved".equalsIgnoreCase(payment.getStatus())) {
            pedido.setPagado(true);
            pedidoRepository.save(pedido);

            if (pedido.getFacturaVenta() == null) {
                var factura = facturaService.generarFactura(pedido);
                pedido.setFacturaVenta(factura);
                pedidoRepository.save(pedido);
                emailService.enviarFactura(factura);
            }
        }
    }

    @SuppressWarnings("unchecked")
    private String extractPaymentId(Map<String, Object> payload, Map<String, String> queryParams) {
        if (payload != null) {
            Object dataObj = payload.get("data");
            if (dataObj instanceof Map<?, ?> data && data.get("id") != null) {
                return String.valueOf(data.get("id"));
            }
            if (payload.get("id") != null) {
                return String.valueOf(payload.get("id"));
            }
        }

        if (queryParams != null) {
            if (queryParams.get("data.id") != null) {
                return queryParams.get("data.id");
            }
            if (queryParams.get("id") != null) {
                return queryParams.get("id");
            }
        }

        return null;
    }
}
