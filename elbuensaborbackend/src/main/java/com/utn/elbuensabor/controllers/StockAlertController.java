package com.utn.elbuensabor.controllers;

import com.utn.elbuensabor.dtos.StockAlertaDTO;
import com.utn.elbuensabor.services.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockAlertController {

    private final StockService stockService;

    @GetMapping("/alertas")
    public ResponseEntity<List<StockAlertaDTO>> alertas(@RequestParam Long sucursalId) {
        return ResponseEntity.ok(stockService.obtenerAlertas(sucursalId));
    }
}

