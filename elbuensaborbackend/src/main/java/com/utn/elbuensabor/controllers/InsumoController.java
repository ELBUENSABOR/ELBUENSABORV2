package com.utn.elbuensabor.controllers;

import java.util.List;

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

import com.utn.elbuensabor.dtos.ArticuloInsumoRequest;
import com.utn.elbuensabor.dtos.ArticuloInsumoResponse;
import com.utn.elbuensabor.services.ArticuloInsumoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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

    @PutMapping("/{id}/reactivar")
    public ResponseEntity<Void> reactivate(@PathVariable Long id) {
        service.reactivate(id);
        return ResponseEntity.noContent().build();
    }
}

