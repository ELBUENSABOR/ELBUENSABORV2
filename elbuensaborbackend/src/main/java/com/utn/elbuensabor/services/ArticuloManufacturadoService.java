package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.dtos.ArticuloManufacturadoRequest;
import com.utn.elbuensabor.dtos.ArticuloManufacturadoResponse;
import com.utn.elbuensabor.dtos.RecetaItemRequest;
import com.utn.elbuensabor.entities.ArticuloManufacturado;
import com.utn.elbuensabor.entities.ArticuloManufacturadoDetalle;


public interface ArticuloManufacturadoService {

    ArticuloManufacturadoResponse create(ArticuloManufacturadoRequest request);

    ArticuloManufacturadoResponse update(Long id, ArticuloManufacturadoRequest request);

    void delete(Long id);

    void fillFromRequest(ArticuloManufacturado manufacturado, ArticuloManufacturadoRequest request);

    ArticuloManufacturadoDetalle toDetalle(RecetaItemRequest item);

    List<ArticuloManufacturadoResponse> getAllBySucursal(Long sucursalId);
    ArticuloManufacturadoResponse getByIdBySucursal(Long id, Long sucursalId);

    ArticuloManufacturadoResponse toResponse(ArticuloManufacturado manufacturado, Long sucursalId);
}

