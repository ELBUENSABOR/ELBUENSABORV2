package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.dtos.CategoriaRequest;
import com.utn.elbuensabor.dtos.CategoriaResponse;
import com.utn.elbuensabor.entities.CategoriaArticuloManufacturado;


public interface CategoriaArticuloManufacturadoService {

    List<CategoriaResponse> getAll();

    CategoriaResponse getById(Long id);

    CategoriaResponse create(CategoriaRequest request);

    CategoriaResponse update(Long id, CategoriaRequest request);

    void delete(Long id);


    CategoriaResponse toResponse(CategoriaArticuloManufacturado entity);
}

