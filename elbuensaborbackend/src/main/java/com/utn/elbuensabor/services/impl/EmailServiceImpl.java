package com.utn.elbuensabor.services.impl;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.entities.NotaCreditoVenta;
import com.utn.elbuensabor.services.EmailService;
import lombok.extern.slf4j.Slf4j;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Value("${resend.api-key:}")
    private String resendApiKey;

    @Value("${app.mail.from:onboarding@resend.dev}")
    private String fromAddress;

    @Value("${resend.test-recipient:}")
    private String testRecipient;

    @Override
    public void enviarFactura(FacturaVenta factura) {
        if (!isConfigured()) {
            log.error("Falta RESEND_API_KEY en las variables de entorno.");
            return;
        }
        if (factura == null || factura.getPedido() == null
                || factura.getPedido().getCliente() == null) return;

        String destinatario = factura.getPedido().getCliente().getEmail();
        if (destinatario == null || destinatario.isBlank()) return;

        String pagoInfo = (factura.getPaymentId() != null && !factura.getPaymentId().isBlank())
                ? "\nID de pago: " + factura.getPaymentId() : "";

        String cuerpo = String.format(
                "Hola %s,\n\nTu factura %s ya está disponible.\nTotal: $%.2f\nPedido: %s%s\n\nGracias por tu compra.",
                factura.getPedido().getCliente().getNombre(),
                factura.getNumeroComprobante(),
                factura.getTotalVenta(),
                factura.getPedido().getNumero(),
                pagoInfo
        );

        enviar(destinatario, "Factura " + factura.getNumeroComprobante(), cuerpo, factura.getNumeroComprobante(), factura.getPdfUrl());
    }

    @Override
    public void enviarNotaCredito(NotaCreditoVenta notaCredito) {
        if (!isConfigured()) {
            log.error("Falta RESEND_API_KEY en las variables de entorno.");
            return;
        }
        if (notaCredito == null || notaCredito.getPedido() == null
                || notaCredito.getPedido().getCliente() == null) return;

        String destinatario = notaCredito.getPedido().getCliente().getEmail();
        if (destinatario == null || destinatario.isBlank()) return;

        String cuerpo = String.format(
                "Hola %s,\n\nSe emitió la nota de crédito %s para anular la factura %s.\nTotal: $%.2f\nPedido: %s\n\nAdjuntamos el comprobante.",
                notaCredito.getPedido().getCliente().getNombre(),
                notaCredito.getNumeroComprobante(),
                notaCredito.getFacturaOriginal() != null
                        ? notaCredito.getFacturaOriginal().getNumeroComprobante() : "-",
                notaCredito.getTotal(),
                notaCredito.getPedido().getNumero()
        );

        enviar(destinatario, "Nota de crédito " + notaCredito.getNumeroComprobante(), cuerpo, notaCredito.getNumeroComprobante(), notaCredito.getPdfUrl());
    }

    private void enviar(String destinatario, String asunto, String cuerpo, String comprobante, String pdfUrl) {
        try {
            String to = (testRecipient != null && !testRecipient.isBlank())
                    ? testRecipient : destinatario;

            Resend resend = new Resend(resendApiKey);

            var builder = CreateEmailOptions.builder()
                    .from(fromAddress)
                    .to(to)
                    .subject(asunto)
                    .text(cuerpo + (to.equals(destinatario) ? "" : "\n\n[TEST - destinatario original: " + destinatario + "]"));

            Path pdfPath = resolvePdfPath(pdfUrl);
            if (pdfPath != null && Files.exists(pdfPath)) {
                byte[] pdfBytes = Files.readAllBytes(pdfPath);
                String base64 = java.util.Base64.getEncoder().encodeToString(pdfBytes);
                builder.attachments(java.util.List.of(
                        com.resend.services.emails.model.Attachment.builder()
                                .fileName(pdfPath.getFileName().toString())
                                .content(base64)
                                .build()
                ));
                log.info("PDF adjuntado: {}", pdfPath.getFileName());
            } else {
                log.warn("PDF no encontrado para {}, se envía sin adjunto", comprobante);
            }

            resend.emails().send(builder.build());
            log.info("Email enviado a {} — {}", to, comprobante);
        } catch (Exception ex) {
            log.error("No se pudo enviar email a {} ({}): {}", destinatario, comprobante, ex.getMessage(), ex);
        }
    }

    private boolean isConfigured() {
        return resendApiKey != null && !resendApiKey.isBlank();
    }

    private Path resolvePdfPath(String pdfUrl) {
        if (pdfUrl == null || pdfUrl.isBlank()) {
            return null;
        }
        String normalized = pdfUrl.startsWith("/") ? pdfUrl.substring(1) : pdfUrl;
        Path direct = Path.of(normalized);
        if (Files.exists(direct)) {
            return direct;
        }
        Path fromParent = Path.of("..", normalized);
        if (Files.exists(fromParent)) {
            return fromParent;
        }
        return direct;
    }
}