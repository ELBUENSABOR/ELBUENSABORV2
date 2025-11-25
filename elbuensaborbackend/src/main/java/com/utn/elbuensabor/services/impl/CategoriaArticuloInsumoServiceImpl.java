package com.utn.elbuensabor.services.impl;

import java.util.List;

import com.utn.elbuensabor.services.CategoriaArticuloInsumoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.dtos.CategoriaRequest;
import com.utn.elbuensabor.dtos.CategoriaResponse;
import com.utn.elbuensabor.entities.CategoriaArticuloInsumo;
import com.utn.elbuensabor.repositories.CategoriaArticuloInsumoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaArticuloInsumoServiceImpl implements CategoriaArticuloInsumoService {

    private final CategoriaArticuloInsumoRepository categoriaRepo;

    public List<CategoriaResponse> getAll() {
        return categoriaRepo.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoriaResponse getById(Long id) {
        CategoriaArticuloInsumo categoria = categoriaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubro de insumo no encontrado"));
        return toResponse(categoria);
    }

    @Transactional
    public CategoriaResponse create(CategoriaRequest request) {
        CategoriaArticuloInsumo categoria = new CategoriaArticuloInsumo();
        categoria.setDenominacion(request.denominacion());
        setParent(categoria, request.categoriaPadreId());
        categoriaRepo.save(categoria);
        return toResponse(categoria);
    }

    @Transactional
    public CategoriaResponse update(Long id, CategoriaRequest request) {
        CategoriaArticuloInsumo categoria = categoriaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubro de insumo no encontrado"));
        categoria.setDenominacion(request.denominacion());
        setParent(categoria, request.categoriaPadreId());
        return toResponse(categoria);
    }

    public void delete(Long id) {
        if (!categoriaRepo.existsById(id)) {
            throw new RuntimeException("Rubro de insumo no encontrado");
        }
        categoriaRepo.deleteById(id);
    }

    public void setParent(CategoriaArticuloInsumo categoria, Long parentId) {
        if (parentId != null) {
            CategoriaArticuloInsumo padre = categoriaRepo.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Rubro padre no encontrado"));
            categoria.setCategoriaPadre(padre);
        } else {
            categoria.setCategoriaPadre(null);
        }
    }

    public CategoriaResponse toResponse(CategoriaArticuloInsumo entity) {
        Long parentId = entity.getCategoriaPadre() != null ? entity.getCategoriaPadre().getId() : null;
        return new CategoriaResponse(
                entity.getId(),
                entity.getDenominacion(),
                parentId);
    }
}

