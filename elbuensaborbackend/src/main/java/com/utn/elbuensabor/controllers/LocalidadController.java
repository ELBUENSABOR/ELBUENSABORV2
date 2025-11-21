package com.utn.elbuensabor.controllers;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.utn.elbuensabor.dtos.LocalidadDTO;
import com.utn.elbuensabor.services.LocalidadService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/localidad")
@RequiredArgsConstructor
@Validated
public class LocalidadController {

    private final LocalidadService localidadService;

    @GetMapping
    public List<LocalidadDTO> getLocalidades() {
        return localidadService.getAllLocalidades();
    }

}
