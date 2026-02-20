package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.ArticuloInsumoRequest;
import com.utn.elbuensabor.dtos.ArticuloInsumoResponse;
import com.utn.elbuensabor.entities.ArticuloInsumo;

import java.util.List;


public interface ArticuloInsumoService {

    List<ArticuloInsumoResponse> getAll();

    ArticuloInsumoResponse getById(Long id);

    ArticuloInsumoResponse create(ArticuloInsumoRequest request);

    ArticuloInsumoResponse update(Long id, ArticuloInsumoRequest request);

    void delete(Long id);

    void fillFromRequest(ArticuloInsumo insumo, ArticuloInsumoRequest request);

    ArticuloInsumoResponse toResponse(ArticuloInsumo insumo);

}

