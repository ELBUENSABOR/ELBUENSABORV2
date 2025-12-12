package com.utn.elbuensabor.controllers;

import java.util.List;

import com.utn.elbuensabor.dtos.ArticuloManufacturadoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.utn.elbuensabor.dtos.ArticuloManufacturadoRequest;
import com.utn.elbuensabor.services.ArticuloManufacturadoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/manufacturados")
@Validated
@RequiredArgsConstructor
public class ManufacturadoController {

    private final ArticuloManufacturadoService service;

    @GetMapping
    public ResponseEntity<List<ArticuloManufacturadoResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticuloManufacturadoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ArticuloManufacturadoResponse> create(@RequestBody @Valid ArticuloManufacturadoRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticuloManufacturadoResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid ArticuloManufacturadoRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

