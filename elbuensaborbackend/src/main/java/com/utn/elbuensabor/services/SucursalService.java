package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.dtos.SucursalDTO;
import com.utn.elbuensabor.entities.SucursalEmpresa;

public interface SucursalService {

    List<SucursalDTO> getAll();

    SucursalDTO getById(Long id);

    SucursalDTO createSucursal(SucursalDTO sucursal);

    SucursalDTO updateSucursal(Long id, SucursalDTO sucursal);

    SucursalDTO toDTO(SucursalEmpresa sucursal);

    void deleteSucursal(Long id);
}

