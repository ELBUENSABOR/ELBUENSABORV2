package com.utn.elbuensabor.services.impl;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.entities.NotaCreditoVenta;
import com.utn.elbuensabor.services.EmailService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.nio.file.Files;
import java.nio.file.Path;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:}")
    private String fromAddress;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${spring.mail.password:}")
    private String smtpPassword;

    public void enviarFactura(FacturaVenta factura) {
        if (!isSmtpConfigured()) {
            log.error("No se puede enviar factura por email porque faltan credenciales SMTP. Configurá SPRING_MAIL_USERNAME y SPRING_MAIL_PASSWORD en el entorno.");
            return;
        }

        if (factura == null || factura.getPedido() == null || factura.getPedido().getCliente() == null) {
            return;
        }

        String destinatario = factura.getPedido().getCliente().getEmail();
        if (destinatario == null || destinatario.isBlank()) {
            return;
        }

        String pagoInfo = (factura.getPaymentId() != null && !factura.getPaymentId().isBlank())
                ? "\nID de pago: " + factura.getPaymentId()
                : "";
        String cuerpo = String.format(
                "Hola %s,\n\nTu factura %s ya está disponible.\nTotal: $%.2f\nPedido: %s%s\n\nGracias por tu compra.",
                factura.getPedido().getCliente().getNombre(),
                factura.getNumeroComprobante(),
                factura.getTotalVenta(),
                factura.getPedido().getNumero(),
                pagoInfo
        );

        try {
            Path pdfPath = resolvePdfPath(factura.getPdfUrl());
            if (pdfPath != null && Files.exists(pdfPath)) {
                var mimeMessage = mailSender.createMimeMessage();
                var helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setTo(destinatario);
                if (fromAddress != null && !fromAddress.isBlank()) {
                    helper.setFrom(fromAddress);
                }
                helper.setSubject("Factura " + factura.getNumeroComprobante());
                helper.setText(cuerpo);
                helper.addAttachment(pdfPath.getFileName().toString(), pdfPath.toFile());
                mailSender.send(mimeMessage);
            } else {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(destinatario);
                if (fromAddress != null && !fromAddress.isBlank()) {
                    message.setFrom(fromAddress);
                }
                message.setSubject("Factura " + factura.getNumeroComprobante());
                message.setText(cuerpo);
                mailSender.send(message);
            }
            log.info("Enviando mail a {} por factura {}", destinatario, factura.getNumeroComprobante());
        } catch (MailException | MessagingException ex) {
            log.error("No se pudo enviar la factura por email a {} (factura {}): {}", destinatario, factura.getNumeroComprobante(), ex.getMessage(), ex);
        }
    }

    public void enviarNotaCredito(NotaCreditoVenta notaCredito) {
        if (!isSmtpConfigured()) {
            log.error("No se puede enviar nota de crédito por email porque faltan credenciales SMTP. Configurá SPRING_MAIL_USERNAME y SPRING_MAIL_PASSWORD en el entorno.");
            return;
        }

        if (notaCredito == null || notaCredito.getPedido() == null || notaCredito.getPedido().getCliente() == null) {
            return;
        }

        String destinatario = notaCredito.getPedido().getCliente().getEmail();
        if (destinatario == null || destinatario.isBlank()) {
            return;
        }

        String cuerpo = String.format(
                "Hola %s,\n\nSe emitió la nota de crédito %s para anular la factura %s.\nTotal: $%.2f\nPedido: %s\n\nAdjuntamos el comprobante en PDF.",
                notaCredito.getPedido().getCliente().getNombre(),
                notaCredito.getNumeroComprobante(),
                notaCredito.getFacturaOriginal() != null ? notaCredito.getFacturaOriginal().getNumeroComprobante() : "-",
                notaCredito.getTotal(),
                notaCredito.getPedido().getNumero()
        );

        try {
            Path pdfPath = resolvePdfPath(notaCredito.getPdfUrl());
            if (pdfPath != null && Files.exists(pdfPath)) {
                var mimeMessage = mailSender.createMimeMessage();
                var helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setTo(destinatario);
                if (fromAddress != null && !fromAddress.isBlank()) {
                    helper.setFrom(fromAddress);
                }
                helper.setSubject("Nota de crédito " + notaCredito.getNumeroComprobante());
                helper.setText(cuerpo);
                helper.addAttachment(pdfPath.getFileName().toString(), pdfPath.toFile());
                mailSender.send(mimeMessage);
            } else {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(destinatario);
                if (fromAddress != null && !fromAddress.isBlank()) {
                    message.setFrom(fromAddress);
                }
                message.setSubject("Nota de crédito " + notaCredito.getNumeroComprobante());
                message.setText(cuerpo);
                mailSender.send(message);
            }
            log.info("Enviando mail a {} por nota de crédito {}", destinatario, notaCredito.getNumeroComprobante());
        } catch (MailException | MessagingException ex) {
            log.error("No se pudo enviar la nota de crédito por email a {} (nota {}): {}", destinatario, notaCredito.getNumeroComprobante(), ex.getMessage(), ex);
        }
    }

    private boolean isSmtpConfigured() {
        return smtpUsername != null && !smtpUsername.isBlank()
                && smtpPassword != null && !smtpPassword.isBlank();
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