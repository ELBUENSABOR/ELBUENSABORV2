package com.utn.elbuensabor.controllers;

import com.utn.elbuensabor.dtos.ArticuloManufacturadoRequest;
import com.utn.elbuensabor.dtos.ArticuloManufacturadoResponse;
import com.utn.elbuensabor.services.ArticuloManufacturadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manufacturados")
@Validated
@RequiredArgsConstructor
public class ManufacturadoController {

    private final ArticuloManufacturadoService service;

    @GetMapping
    public ResponseEntity<List<ArticuloManufacturadoResponse>> getAll(
            @RequestParam Long sucursalId
    ) {
        return ResponseEntity.ok(service.getAllBySucursal(sucursalId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticuloManufacturadoResponse> getById(
            @PathVariable Long id,
            @RequestParam Long sucursalId
    ) {
        return ResponseEntity.ok(service.getByIdBySucursal(id, sucursalId));
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

