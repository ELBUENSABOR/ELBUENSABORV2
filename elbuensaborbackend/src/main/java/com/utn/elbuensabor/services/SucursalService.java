package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.SucursalDTO;
import com.utn.elbuensabor.entities.SucursalEmpresa;

import java.util.List;

public interface SucursalService {

    List<SucursalDTO> getAll();

    SucursalDTO getById(Long id);

    SucursalDTO createSucursal(SucursalDTO sucursal);

    SucursalDTO updateSucursal(Long id, SucursalDTO sucursal);

    SucursalDTO toDTO(SucursalEmpresa sucursal);
}

