package com.utn.elbuensabor.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.utn.elbuensabor.dtos.RegistroCompraDTO;
import com.utn.elbuensabor.dtos.RegistroCompraRequest;
import com.utn.elbuensabor.services.CompraInsumoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/insumos/compras")
@RequiredArgsConstructor
@Validated
public class CompraInsumoController {

    private final CompraInsumoService service;

    @GetMapping
    public ResponseEntity<List<RegistroCompraDTO>> getAll() {
        return ResponseEntity.ok(service.getAllRegistros());
    }

    @PostMapping
    public ResponseEntity<Void> registrarCompra(
            @RequestBody @Valid RegistroCompraRequest request) {
        service.registrarCompra(request);
        return ResponseEntity.ok().build();
    }
}
