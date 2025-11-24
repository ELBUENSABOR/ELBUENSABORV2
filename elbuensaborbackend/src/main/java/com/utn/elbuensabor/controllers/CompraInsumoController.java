package com.utn.elbuensabor.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.utn.elbuensabor.dtos.RegistroCompraRequest;
import com.utn.elbuensabor.services.CompraInsumoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/insumos/{id}/compras")
@RequiredArgsConstructor
@Validated
public class CompraInsumoController {

    private final CompraInsumoService service;

    @PostMapping
    public ResponseEntity<Void> registrarCompra(
            @PathVariable("id") Long insumoId,
            @RequestBody @Valid RegistroCompraRequest request) {
        service.registrarCompra(insumoId, request);
        return ResponseEntity.ok().build();
    }
}

