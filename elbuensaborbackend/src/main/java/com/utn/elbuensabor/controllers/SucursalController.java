package com.utn.elbuensabor.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.utn.elbuensabor.dtos.SucursalDTO;
import com.utn.elbuensabor.services.SucursalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sucursales")
@RequiredArgsConstructor
public class SucursalController {

    private final SucursalService sucursalService;

    @GetMapping
    public ResponseEntity<List<SucursalDTO>> getAll() {
        return ResponseEntity.ok(sucursalService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SucursalDTO> getSucursalById(@PathVariable Long id) {
        return ResponseEntity.ok(sucursalService.getById(id));
    }

    @PostMapping
    public ResponseEntity<SucursalDTO> create(@RequestBody SucursalDTO sucursal) {
        return ResponseEntity.ok(sucursalService.createSucursal(sucursal));
    }
}

