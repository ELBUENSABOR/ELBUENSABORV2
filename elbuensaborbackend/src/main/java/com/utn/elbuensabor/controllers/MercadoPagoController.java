package com.utn.elbuensabor.controllers;

import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.client.payment.PaymentClient;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Map;

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
    public ResponseEntity<Void> webhook(@RequestBody Map<String, Object> payload) {

        Map<String, Object> data = (Map<String, Object>) payload.get("data");
        if (data == null || data.get("id") == null) return ResponseEntity.ok().build();

        String paymentId = String.valueOf(data.get("id"));

        try {
            Payment payment = new PaymentClient().get(Long.valueOf(paymentId));
            String externalReference = payment.getExternalReference();
            if (externalReference == null) {
                return ResponseEntity.ok().build();
            }

            Long pedidoId = Long.valueOf(externalReference);
            PedidoVenta pedido = pedidoRepository.findByIdWithDetalles(pedidoId)
                    .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

            DatosMercadoPago datos = datosMercadoPagoRepository.findByPedidoId(pedidoId)
                    .orElseGet(DatosMercadoPago::new);
            datos.setPedido(pedido);
            datos.setPaymentId(paymentId);
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
        } catch (Exception ex) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.ok().build();
    }

    private LocalDateTime toLocalDateTime(OffsetDateTime dateTime) {
        return dateTime != null ? dateTime.toLocalDateTime() : null;
    }
}