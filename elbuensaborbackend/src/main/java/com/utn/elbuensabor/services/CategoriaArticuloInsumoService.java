package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.dtos.CategoriaRequest;
import com.utn.elbuensabor.dtos.CategoriaResponse;
import com.utn.elbuensabor.entities.CategoriaArticuloInsumo;

public interface CategoriaArticuloInsumoService {

    List<CategoriaResponse> getAll();

    CategoriaResponse getById(Long id);

    CategoriaResponse create(CategoriaRequest request);

    CategoriaResponse update(Long id, CategoriaRequest request);

    void delete(Long id);

    void setParent(CategoriaArticuloInsumo categoria, Long parentId);

    CategoriaResponse toResponse(CategoriaArticuloInsumo entity);
}

