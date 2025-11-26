package com.utn.elbuensabor.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.utn.elbuensabor.dtos.UserDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> create(@RequestBody @Valid SucursalDTO sucursal) {
        SucursalDTO result = sucursalService.createSucursal(sucursal);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id , @RequestBody @Valid SucursalDTO sucursal) {
        SucursalDTO result = sucursalService.updateSucursal(id, sucursal);
        return ResponseEntity.ok(result);
    }
}

