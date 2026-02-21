package com.utn.elbuensabor.services.impl;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.services.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public void enviarFactura(FacturaVenta factura) {
        if (factura == null || factura.getPedido() == null || factura.getPedido().getCliente() == null) {
            return;
        }

        String destinatario = factura.getPedido().getCliente().getEmail();
        if (destinatario == null || destinatario.isBlank()) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject("Factura " + factura.getNumeroComprobante());
        message.setText(String.format(
                "Hola %s,\n\nTu factura %s ya está disponible.\nTotal: $%.2f\nPedido: %s\n\nGracias por tu compra.",
                factura.getPedido().getCliente().getNombre(),
                factura.getNumeroComprobante(),
                factura.getTotalVenta(),
                factura.getPedido().getNumero()
        ));

        try {
            mailSender.send(message);
            log.info("Enviando mail a {} por factura {}", destinatario, factura.getNumeroComprobante());
        } catch (MailException ex) {
            log.warn("No se pudo enviar la factura por email: {}", ex.getMessage());
        }
    }
}