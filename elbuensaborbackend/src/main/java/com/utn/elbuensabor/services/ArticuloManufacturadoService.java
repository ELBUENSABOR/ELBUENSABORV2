package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.dtos.ArticuloManufacturadoRequest;
import com.utn.elbuensabor.dtos.ArticuloResponse;
import com.utn.elbuensabor.dtos.RecetaItemRequest;
import com.utn.elbuensabor.entities.ArticuloManufacturado;
import com.utn.elbuensabor.entities.ArticuloManufacturadoDetalle;


public interface ArticuloManufacturadoService {

    List<ArticuloResponse> getAll();

    ArticuloResponse getById(Long id);

    ArticuloResponse create(ArticuloManufacturadoRequest request);

    ArticuloResponse update(Long id, ArticuloManufacturadoRequest request);

    void delete(Long id);

    void fillFromRequest(ArticuloManufacturado manufacturado, ArticuloManufacturadoRequest request);

    ArticuloManufacturadoDetalle toDetalle(RecetaItemRequest item);

    ArticuloResponse toResponse(ArticuloManufacturado manufacturado);
}

