package com.utn.elbuensabor.controllers;

import com.utn.elbuensabor.dtos.SucursalManufacturadoFullResponse;
import com.utn.elbuensabor.dtos.SucursalManufacturadoRequest;
import com.utn.elbuensabor.dtos.SucursalManufacturadoResponse;
import com.utn.elbuensabor.services.SucursalManufacturadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sucursales/{sucursalId}/manufacturados")
@RequiredArgsConstructor
public class SucursalManufacturadoController {
    private final SucursalManufacturadoService service;

    @GetMapping
    public ResponseEntity<List<SucursalManufacturadoResponse>> getAll(@PathVariable Long sucursalId) {
        return ResponseEntity.ok(service.getAllBySucursal(sucursalId));
    }

    @PostMapping
    public ResponseEntity<SucursalManufacturadoResponse> create(
            @PathVariable Long sucursalId,
            @RequestBody @Valid SucursalManufacturadoRequest request
    ) {
        return ResponseEntity.ok(service.create(sucursalId, request));
    }

    @PutMapping("/{manufacturadoId}")
    public ResponseEntity<SucursalManufacturadoResponse> update(
            @PathVariable Long sucursalId,
            @PathVariable Long manufacturadoId,
            @RequestBody @Valid SucursalManufacturadoRequest request
    ) {
        return ResponseEntity.ok(service.update(sucursalId, manufacturadoId, request));
    }

    @GetMapping("/{manufacturadoId}")
    public ResponseEntity<SucursalManufacturadoFullResponse> getOne(
            @PathVariable Long sucursalId,
            @PathVariable Long manufacturadoId
    ) {
        return ResponseEntity.ok(service.getOne(sucursalId, manufacturadoId));
    }
}
