package com.utn.elbuensabor.controllers;

import com.utn.elbuensabor.dtos.ReporteClientesPedidosDTO;
import com.utn.elbuensabor.dtos.ReporteProductosVendidosDTO;
import com.utn.elbuensabor.services.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/productos-mas-vendidos")
    public ResponseEntity<ReporteProductosVendidosDTO> productosMasVendidos(
            @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(reporteService.obtenerProductosMasVendidos(desde, hasta));
    }

    @GetMapping("/clientes-por-pedidos")
    public ResponseEntity<List<ReporteClientesPedidosDTO>> clientesPorPedidos(
            @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(value = "orden", defaultValue = "PEDIDOS") String orden) {
        return ResponseEntity.ok(reporteService.obtenerClientesPorPedidos(desde, hasta, orden));
    }
}