package com.utn.elbuensabor.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.utn.elbuensabor.entities.NotaCredito;
import com.utn.elbuensabor.services.NotaCreditoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notas-credito")
@RequiredArgsConstructor
public class NotaCreditoController {

    private final NotaCreditoService notaCreditoService;

    @PostMapping("/factura/{facturaId}")
    public ResponseEntity<?> emitir(@PathVariable Long facturaId) {
        try {
            NotaCredito nota = notaCreditoService.emitirDesdeFactura(facturaId);
            return ResponseEntity.ok(Map.of(
                    "id", nota.getId(),
                    "numeroComprobante", nota.getNumeroComprobante(),
                    "fechaEmision", nota.getFechaEmision(),
                    "facturaId", nota.getFactura().getId(),
                    "pedidoId", nota.getFactura().getPedido().getId(),
                    "total", nota.getTotal()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
