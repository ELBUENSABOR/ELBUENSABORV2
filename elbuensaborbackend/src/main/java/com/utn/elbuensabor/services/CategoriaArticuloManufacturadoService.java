package com.utn.elbuensabor.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.dtos.CategoriaRequest;
import com.utn.elbuensabor.dtos.CategoriaResponse;
import com.utn.elbuensabor.entities.CategoriaArticuloManufacturado;
import com.utn.elbuensabor.repositories.CategoriaArticuloManufacturadoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaArticuloManufacturadoService {

    private final CategoriaArticuloManufacturadoRepository categoriaRepo;

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
        categoriaRepo.save(categoria);
        return toResponse(categoria);
    }

    @Transactional
    public CategoriaResponse update(Long id, CategoriaRequest request) {
        CategoriaArticuloManufacturado categoria = categoriaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubro de producto no encontrado"));
        categoria.setDenominacion(request.denominacion());
        return toResponse(categoria);
    }

    public void delete(Long id) {
        if (!categoriaRepo.existsById(id)) {
            throw new RuntimeException("Rubro de producto no encontrado");
        }
        categoriaRepo.deleteById(id);
    }

    private CategoriaResponse toResponse(CategoriaArticuloManufacturado entity) {
        return new CategoriaResponse(
                entity.getId(),
                entity.getDenominacion(),
                null);
    }
}

