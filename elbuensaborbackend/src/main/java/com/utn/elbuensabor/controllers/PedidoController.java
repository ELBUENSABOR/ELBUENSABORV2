package com.utn.elbuensabor.controllers;

import com.utn.elbuensabor.dtos.PedidoRequest;
import com.utn.elbuensabor.dtos.PedidoResponse;
import com.utn.elbuensabor.entities.EstadoPedido;
import com.utn.elbuensabor.services.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@Validated
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponse> create(@RequestBody @Valid PedidoRequest request) {
        try {
            PedidoResponse response = pedidoService.create(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> getById(@PathVariable Long id) {
        try {
            PedidoResponse response = pedidoService.getById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> getAll(
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) EstadoPedido estado,
            @RequestParam(required = false) Long sucursalId) {

        if (clienteId != null) {
            return ResponseEntity.ok(pedidoService.getByClienteId(clienteId));
        }

        if (estado != null && sucursalId != null) {
            return ResponseEntity.ok(pedidoService.getByEstadoAndSucursalId(estado, sucursalId));
        }

        if (estado != null) {
            return ResponseEntity.ok(pedidoService.getByEstado(estado));
        }

        if (sucursalId != null) {
            return ResponseEntity.ok(pedidoService.getBySucursalId(sucursalId));
        }

        return ResponseEntity.ok(pedidoService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid PedidoRequest request) {
        try {
            PedidoResponse response = pedidoService.update(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            pedidoService.delete(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", ex.getMessage()));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<PedidoResponse> cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String estadoStr = request.get("estado");
            if (estadoStr == null) {
                return ResponseEntity.badRequest().build();
            }

            EstadoPedido nuevoEstado = EstadoPedido.valueOf(estadoStr.toUpperCase());
            PedidoResponse response = pedidoService.cambiarEstado(id, nuevoEstado);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}

