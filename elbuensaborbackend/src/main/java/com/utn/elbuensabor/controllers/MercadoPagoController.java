package com.utn.elbuensabor.controllers;

import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.utn.elbuensabor.entities.FormaPago;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.repositories.PedidoVentaRepository;
import com.utn.elbuensabor.services.MercadoPagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class MercadoPagoController {

    private final PedidoVentaRepository pedidoRepository;
    private final MercadoPagoService mpService;

    @PostMapping("/mercadopago/{pedidoId}")
    public ResponseEntity<?> crearPago(@PathVariable Long pedidoId) throws MPException, MPApiException {

        PedidoVenta pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (pedido.getFormaPago() != FormaPago.MP) {
            return ResponseEntity.badRequest().build();
        }

        String initPoint = mpService.crearPreference(pedido);

        return ResponseEntity.ok(Map.of("initPoint", initPoint));
    }

    @PostMapping("/mercadopago/webhook")
    public ResponseEntity<Void> webhook(@RequestBody Map<String, Object> payload) {

        Map<String, Object> data = (Map<String, Object>) payload.get("data");
        if (data == null) return ResponseEntity.ok().build();

        String paymentId = String.valueOf(data.get("id"));

        // acá:
        // 1. consultar el payment a MP
        // 2. obtener external_reference (pedidoId)
        // 3. marcar pedido como PAGADO
        // 4. guardar payment_id
        // 5. generar factura

        return ResponseEntity.ok().build();
    }

}