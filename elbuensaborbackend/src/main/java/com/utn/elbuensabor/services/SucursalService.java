package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.dtos.SucursalDTO;
import com.utn.elbuensabor.entities.SucursalEmpresa;

public interface SucursalService {

    public List<SucursalDTO> getAll();

    public SucursalDTO getById(Long id);

    public SucursalDTO createSucursal(SucursalDTO sucursal);

    SucursalDTO toDTO(SucursalEmpresa sucursal);
}

