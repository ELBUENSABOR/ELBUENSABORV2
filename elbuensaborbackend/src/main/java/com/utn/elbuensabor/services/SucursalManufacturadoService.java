package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.SucursalManufacturadoFullResponse;
import com.utn.elbuensabor.dtos.SucursalManufacturadoRequest;
import com.utn.elbuensabor.dtos.SucursalManufacturadoResponse;
import com.utn.elbuensabor.entities.SucursalManufacturado;
import com.utn.elbuensabor.services.impl.SucursalManufacturadoServiceImpl;

import java.util.List;

public interface SucursalManufacturadoService {
    public List<SucursalManufacturadoResponse> getAllBySucursal(Long sucursalId);
    public SucursalManufacturadoResponse create(Long sucursalId, SucursalManufacturadoRequest request);
    public SucursalManufacturadoResponse update(Long sucursalId, Long manufacturadoId, SucursalManufacturadoRequest request);
    public SucursalManufacturadoFullResponse getOne(Long sucursalId, Long manufacturadoId);
    public SucursalManufacturadoResponse toResponse(SucursalManufacturado entity);
}
