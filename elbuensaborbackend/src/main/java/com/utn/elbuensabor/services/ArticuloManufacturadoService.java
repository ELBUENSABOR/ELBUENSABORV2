package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.dtos.ArticuloManufacturadoRequest;
import com.utn.elbuensabor.dtos.ArticuloInsumoResponse;
import com.utn.elbuensabor.dtos.ArticuloManufacturadoResponse;
import com.utn.elbuensabor.dtos.RecetaItemRequest;
import com.utn.elbuensabor.entities.ArticuloManufacturado;
import com.utn.elbuensabor.entities.ArticuloManufacturadoDetalle;


public interface ArticuloManufacturadoService {

    List<ArticuloManufacturadoResponse> getAll();

    ArticuloManufacturadoResponse getById(Long id);

    ArticuloManufacturadoResponse create(ArticuloManufacturadoRequest request);

    ArticuloManufacturadoResponse update(Long id, ArticuloManufacturadoRequest request);

    void delete(Long id);

    void fillFromRequest(ArticuloManufacturado manufacturado, ArticuloManufacturadoRequest request);

    ArticuloManufacturadoDetalle toDetalle(RecetaItemRequest item);

    ArticuloManufacturadoResponse toResponse(ArticuloManufacturado manufacturado);
}

