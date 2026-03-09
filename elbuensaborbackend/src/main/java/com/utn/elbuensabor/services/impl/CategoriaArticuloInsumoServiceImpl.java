package com.utn.elbuensabor.services.impl;

import java.util.List;

import com.utn.elbuensabor.entities.ArticuloInsumo;
import com.utn.elbuensabor.services.CategoriaArticuloInsumoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.dtos.CategoriaRequest;
import com.utn.elbuensabor.dtos.CategoriaResponse;
import com.utn.elbuensabor.entities.CategoriaArticuloInsumo;
import com.utn.elbuensabor.repositories.ArticuloInsumoRepository;
import com.utn.elbuensabor.repositories.CategoriaArticuloInsumoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaArticuloInsumoServiceImpl implements CategoriaArticuloInsumoService {

    private final CategoriaArticuloInsumoRepository categoriaRepo;
    private final ArticuloInsumoRepository insumoRepo;

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
        categoria.setActivo(true);
        setParent(categoria, request.categoriaPadreId());
        categoriaRepo.save(categoria);
        return toResponse(categoria);
    }

    @Transactional
    public CategoriaResponse update(Long id, CategoriaRequest request) {
        CategoriaArticuloInsumo categoria = categoriaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubro de insumo no encontrado"));
        categoria.setDenominacion(request.denominacion());
        categoria.setActivo(request.activo());

        boolean shouldCascadeDeactivate = Boolean.FALSE.equals(request.activo()) && categoria.isActivo();

        setParent(categoria, request.categoriaPadreId());

        if (shouldCascadeDeactivate) {
            desactivarInsumosActivosDeCategoria(categoria.getId());
        }
        return toResponse(categoria);
    }

    public void delete(Long id) {
        CategoriaArticuloInsumo categoria = categoriaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubro de insumo no encontrado"));
        categoria.setActivo(false);
        categoriaRepo.save(categoria);
        desactivarInsumosActivosDeCategoria(categoria.getId());
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

    private void desactivarInsumosActivosDeCategoria(Long categoriaId) {
        List<ArticuloInsumo> insumosActivos = insumoRepo.findAllByCategoriaArticuloInsumoIdAndActivoTrue(categoriaId);
        for (ArticuloInsumo insumo : insumosActivos) {
            insumo.setActivo(false);
        }
        insumoRepo.saveAll(insumosActivos);
    }

    public CategoriaResponse toResponse(CategoriaArticuloInsumo entity) {
        Long parentId = entity.getCategoriaPadre() != null ? entity.getCategoriaPadre().getId() : null;
        return new CategoriaResponse(
                entity.getId(),
                entity.getDenominacion(),
                parentId,
                entity.isActivo());
    }
}
