package com.utn.elbuensabor.services.impl;

import java.util.List;

import com.utn.elbuensabor.services.ArticuloInsumoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.dtos.ArticuloInsumoRequest;
import com.utn.elbuensabor.dtos.ArticuloResponse;
import com.utn.elbuensabor.entities.ArticuloInsumo;
import com.utn.elbuensabor.entities.CategoriaArticuloInsumo;
import com.utn.elbuensabor.repositories.ArticuloInsumoRepository;
import com.utn.elbuensabor.repositories.CategoriaArticuloInsumoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticuloInsumoServiceImpl implements ArticuloInsumoService {

    private final ArticuloInsumoRepository insumoRepo;
    private final CategoriaArticuloInsumoRepository categoriaRepo;

    public List<ArticuloResponse> getAll() {
        return insumoRepo.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ArticuloResponse getById(Long id) {
        ArticuloInsumo insumo = insumoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
        return toResponse(insumo);
    }

    @Transactional
    public ArticuloResponse create(ArticuloInsumoRequest request) {
        ArticuloInsumo insumo = new ArticuloInsumo();
        fillFromRequest(insumo, request);
        insumoRepo.save(insumo);
        return toResponse(insumo);
    }

    @Transactional
    public ArticuloResponse update(Long id, ArticuloInsumoRequest request) {
        ArticuloInsumo insumo = insumoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
        fillFromRequest(insumo, request);
        return toResponse(insumo);
    }

    public void delete(Long id) {
        ArticuloInsumo insumo = insumoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
        insumo.setActivo(false);
        insumoRepo.save(insumo);
    }

    public void fillFromRequest(ArticuloInsumo insumo, ArticuloInsumoRequest request) {
        CategoriaArticuloInsumo categoria = categoriaRepo.findById(request.categoriaId())
                .orElseThrow(() -> new RuntimeException("Rubro de insumo no encontrado"));
        insumo.setDenominacion(request.denominacion());
        insumo.setPrecioVenta(request.precioVenta());
        insumo.setPrecioCompra(request.precioCompra());
        insumo.setCategoriaArticuloInsumo(categoria);
        insumo.setActivo(request.activo() == null || request.activo());
        insumo.setEsParaElaborar(Boolean.TRUE.equals(request.esParaElaborar()));
    }

    public ArticuloResponse toResponse(ArticuloInsumo insumo) {
        String categoria = insumo.getCategoriaArticuloInsumo() != null
                ? insumo.getCategoriaArticuloInsumo().getDenominacion()
                : null;
        return new ArticuloResponse(
                insumo.getId(),
                insumo.getDenominacion(),
                null,
                insumo.getPrecioVenta(),
                insumo.getPrecioCompra(),
                null,
                categoria,
                insumo.getEsParaElaborar(),
                insumo.getActivo(),
                List.of());
    }
}

