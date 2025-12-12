package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.dtos.UnidadMedidaDTO;
import com.utn.elbuensabor.entities.UnidadMedida;
import com.utn.elbuensabor.repositories.UnidadMedidaRepository;
import com.utn.elbuensabor.services.UnidadMedidaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnidadMedidaServiceImpl implements UnidadMedidaService {

    private final UnidadMedidaRepository unidadMedidaRepository;

    @Override
    public List<UnidadMedidaDTO> getAll() {
        return unidadMedidaRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public UnidadMedidaDTO getById(Long id) {
        UnidadMedida unidadMedida = unidadMedidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unidad no encontrada"));
        return toResponse(unidadMedida);
    }

    @Override
    public UnidadMedidaDTO create(UnidadMedidaDTO unidadMedidaDTO) {
        UnidadMedida unidadMedida = new UnidadMedida();
        unidadMedida.setDenominacion(unidadMedidaDTO.denominacion());
        unidadMedida.setActivo(true);
        unidadMedida = unidadMedidaRepository.save(unidadMedida);
        return toResponse(unidadMedida);
    }

    @Override
    public UnidadMedidaDTO update(Long id, UnidadMedidaDTO unidadMedidaDTO) {
        UnidadMedida unidadMedida = unidadMedidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unidad no encontrada"));
        unidadMedida.setDenominacion(unidadMedidaDTO.denominacion());
        unidadMedida = unidadMedidaRepository.save(unidadMedida);
        return toResponse(unidadMedida);
    }

    @Override
    public UnidadMedidaDTO delete(Long id) {
        UnidadMedida unidadMedida = unidadMedidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unidad no encontrada"));
        unidadMedida.setActivo(false);
        unidadMedidaRepository.save(unidadMedida);
        return toResponse(unidadMedida);
    }

    public UnidadMedidaDTO toResponse(UnidadMedida unidadMedida) {
        return new UnidadMedidaDTO(
                unidadMedida.getId(),
                unidadMedida.getDenominacion());
    }
}
