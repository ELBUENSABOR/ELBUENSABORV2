package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.entities.Empresa;
import com.utn.elbuensabor.repositories.EmpresaRepository;
import org.springframework.stereotype.Service;

import com.utn.elbuensabor.dtos.SucursalDTO;
import com.utn.elbuensabor.entities.SucursalEmpresa;
import com.utn.elbuensabor.repositories.SucursalEmpresaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SucursalService {

    private final SucursalEmpresaRepository sucursalRepository;
    private final EmpresaRepository empresaRepository;

    public List<SucursalDTO> getAll() {
        return sucursalRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public SucursalDTO getById(Long id) {
        return toDTO(
                sucursalRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"))
        );
    }

    public SucursalDTO createSucursal(SucursalDTO sucursal) {
        SucursalEmpresa newSucursal = new SucursalEmpresa();

        Empresa e = empresaRepository.findByNombre("ElBuenSabor")
                .orElseThrow(() -> new RuntimeException("Empresa EL BUEN SABOR no encontrada"));

        newSucursal.setNombre(sucursal.nombre());
        newSucursal.setHorarioApertura(sucursal.horarioApertura());
        newSucursal.setHorarioCierre(sucursal.horarioCierre());
        newSucursal.setEmpresa(e);

        SucursalEmpresa guardada = sucursalRepository.save(newSucursal);

        return toDTO(guardada);
    }

    SucursalDTO toDTO(SucursalEmpresa sucursal);
}

