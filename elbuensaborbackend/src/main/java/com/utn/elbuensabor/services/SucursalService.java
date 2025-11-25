package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.dtos.SucursalDTO;
import com.utn.elbuensabor.entities.SucursalEmpresa;


public interface SucursalService {

    List<SucursalDTO> getAll();

    SucursalDTO toDTO(SucursalEmpresa sucursal);
}

