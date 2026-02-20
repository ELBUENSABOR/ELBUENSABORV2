package com.utn.elbuensabor.controllers;

import com.utn.elbuensabor.dtos.UnidadMedidaDTO;
import com.utn.elbuensabor.services.UnidadMedidaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unidades-medida")
@Validated
@RequiredArgsConstructor
public class UnidadMedidaController {

    private final UnidadMedidaService unidadMedidaService;

    @GetMapping
    public ResponseEntity<List<UnidadMedidaDTO>> getAll() {
        return ResponseEntity.ok(unidadMedidaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnidadMedidaDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(unidadMedidaService.getById(id));
    }

    @PostMapping
    public ResponseEntity<UnidadMedidaDTO> create(@Valid @RequestBody UnidadMedidaDTO unidadMedidaDTO) {
        return ResponseEntity.ok(unidadMedidaService.create(unidadMedidaDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnidadMedidaDTO> update(@PathVariable Long id, @Valid @RequestBody UnidadMedidaDTO unidadMedidaDTO) {
        return ResponseEntity.ok(unidadMedidaService.update(id, unidadMedidaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UnidadMedidaDTO> delete(@PathVariable Long id) {
        return ResponseEntity.ok(unidadMedidaService.delete(id));
    }
}
