package com.utn.elbuensabor.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.utn.elbuensabor.dtos.SucursalDTO;
import com.utn.elbuensabor.entities.SucursalEmpresa;
import com.utn.elbuensabor.repositories.SucursalEmpresaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SucursalService {

    private final SucursalEmpresaRepository sucursalRepository;

    public List<SucursalDTO> getAll() {
        return sucursalRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    private SucursalDTO toDTO(SucursalEmpresa sucursal) {
        return new SucursalDTO(
                sucursal.getId(),
                sucursal.getNombre(),
                sucursal.getHorarioApertura(),
                sucursal.getHorarioCierre());
    }
}

