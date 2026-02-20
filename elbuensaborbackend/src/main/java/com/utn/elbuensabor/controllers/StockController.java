package com.utn.elbuensabor.controllers;

import com.utn.elbuensabor.dtos.StockDisponibilidadDTO;
import com.utn.elbuensabor.services.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/verificar-manufacturado")
    public ResponseEntity<StockDisponibilidadDTO> verificarStockManufacturado(
            @RequestParam Long manufacturadoId,
            @RequestParam Integer cantidad,
            @RequestParam Long sucursalId) {

        Double stockActual = stockService.obtenerStockActual(manufacturadoId, sucursalId);
        Boolean disponible = stockService.verificarStockArticuloManufacturado(manufacturadoId, cantidad, sucursalId);

        // Nota: Para manufacturados, necesitaríamos obtener la denominación del artículo
        // Por simplicidad, retornamos un DTO básico
        StockDisponibilidadDTO dto = new StockDisponibilidadDTO(
                manufacturadoId,
                "MANUFACTURADO",
                null,
                disponible,
                stockActual,
                disponible ? "Disponible" : "Stock insuficiente"
        );

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/verificar-insumo")
    public ResponseEntity<StockDisponibilidadDTO> verificarStockInsumo(
            @RequestParam Long insumoId,
            @RequestParam Integer cantidad,
            @RequestParam Long sucursalId) {

        Double stockActual = stockService.obtenerStockActual(insumoId, sucursalId);
        Boolean disponible = stockService.verificarStockInsumo(insumoId, cantidad, sucursalId);

        StockDisponibilidadDTO dto = new StockDisponibilidadDTO(
                insumoId,
                "INSUMO",
                null,
                disponible,
                stockActual,
                disponible ? "Disponible" : "Stock insuficiente"
        );

        return ResponseEntity.ok(dto);
    }
}

