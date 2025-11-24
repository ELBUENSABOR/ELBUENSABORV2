package com.utn.elbuensabor.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

