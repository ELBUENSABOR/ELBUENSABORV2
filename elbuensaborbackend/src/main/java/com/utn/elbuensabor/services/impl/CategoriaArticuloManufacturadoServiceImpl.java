package com.utn.elbuensabor.services.impl;


import java.util.List;

import com.utn.elbuensabor.entities.ArticuloManufacturado;
import com.utn.elbuensabor.services.CategoriaArticuloManufacturadoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.dtos.CategoriaRequest;
import com.utn.elbuensabor.dtos.CategoriaResponse;
import com.utn.elbuensabor.entities.CategoriaArticuloManufacturado;
import com.utn.elbuensabor.repositories.ArticuloManufacturadoRepository;
import com.utn.elbuensabor.repositories.CategoriaArticuloManufacturadoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaArticuloManufacturadoServiceImpl implements CategoriaArticuloManufacturadoService {

    private final CategoriaArticuloManufacturadoRepository categoriaRepo;
    private final ArticuloManufacturadoRepository manufacturadoRepo;

    public List<CategoriaResponse> getAll() {
        return categoriaRepo.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoriaResponse getById(Long id) {
        CategoriaArticuloManufacturado categoria = categoriaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubro de producto no encontrado"));
        return toResponse(categoria);
    }

    @Transactional
    public CategoriaResponse create(CategoriaRequest request) {
        CategoriaArticuloManufacturado categoria = new CategoriaArticuloManufacturado();
        categoria.setDenominacion(request.denominacion());
        categoria.setActivo(true);
        setParent(categoria, request.categoriaPadreId());
        categoriaRepo.save(categoria);
        return toResponse(categoria);
    }

    @Transactional
    public CategoriaResponse update(Long id, CategoriaRequest request) {
        CategoriaArticuloManufacturado categoria = categoriaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubro de producto no encontrado"));
        categoria.setDenominacion(request.denominacion());
        categoria.setActivo(request.activo());
        boolean shouldCascadeDeactivate = Boolean.FALSE.equals(request.activo()) && categoria.isActivo();
        setParent(categoria, request.categoriaPadreId());
        if (shouldCascadeDeactivate) {
            desactivarManufacturadosActivosDeCategoria(categoria.getId());
        }
        return toResponse(categoria);
    }

    public void delete(Long id) {
        CategoriaArticuloManufacturado categoria = categoriaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubro de producto no encontrado"));
        categoria.setActivo(false);
        categoriaRepo.save(categoria);
        desactivarManufacturadosActivosDeCategoria(categoria.getId());
    }

    private void desactivarManufacturadosActivosDeCategoria(Long categoriaId) {
        List<ArticuloManufacturado> manufacturadosActivos = manufacturadoRepo.findAllByCategoriaIdAndActivoTrue(categoriaId);
        for (ArticuloManufacturado manufacturado : manufacturadosActivos) {
            manufacturado.setActivo(false);
        }
        manufacturadoRepo.saveAll(manufacturadosActivos);
    }

    public void setParent(CategoriaArticuloManufacturado categoria, Long parentId) {
        if (parentId != null) {
            CategoriaArticuloManufacturado padre = categoriaRepo.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Rubro padre no encontrado"));
            categoria.setCategoriaPadre(padre);
        } else {
            categoria.setCategoriaPadre(null);
        }
    }

    public CategoriaResponse toResponse(CategoriaArticuloManufacturado entity) {
        Long parentId = entity.getCategoriaPadre() != null ? entity.getCategoriaPadre().getId() : null;
        return new CategoriaResponse(
                entity.getId(),
                entity.getDenominacion(),
                parentId,
                entity.isActivo()
        );
    }
}

