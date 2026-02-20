package com.utn.elbuensabor.controllers;

import com.utn.elbuensabor.dtos.ArticuloInsumoRequest;
import com.utn.elbuensabor.dtos.ArticuloInsumoResponse;
import com.utn.elbuensabor.services.ArticuloInsumoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insumos")
@Validated
@RequiredArgsConstructor
public class InsumoController {

    private final ArticuloInsumoService service;

    @GetMapping
    public ResponseEntity<List<ArticuloInsumoResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticuloInsumoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ArticuloInsumoResponse> create(@RequestBody @Valid ArticuloInsumoRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticuloInsumoResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid ArticuloInsumoRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

