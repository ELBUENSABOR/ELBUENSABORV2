package com.utn.elbuensabor.services;

import java.util.List;

import com.utn.elbuensabor.dtos.ArticuloInsumoRequest;
import com.utn.elbuensabor.dtos.ArticuloResponse;
import com.utn.elbuensabor.entities.ArticuloInsumo;


public interface ArticuloInsumoService {

    List<ArticuloResponse> getAll();

    ArticuloResponse getById(Long id);

    ArticuloResponse create(ArticuloInsumoRequest request);

    ArticuloResponse update(Long id, ArticuloInsumoRequest request);

    void delete(Long id);

    void fillFromRequest(ArticuloInsumo insumo, ArticuloInsumoRequest request);

    ArticuloResponse toResponse(ArticuloInsumo insumo);

}

