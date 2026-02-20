package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.UnidadMedidaDTO;

import java.util.List;

public interface UnidadMedidaService {
    List<UnidadMedidaDTO> getAll();

    UnidadMedidaDTO getById(Long id);

    UnidadMedidaDTO create(UnidadMedidaDTO unidadMedidaDTO);

    UnidadMedidaDTO update(Long id, UnidadMedidaDTO unidadMedidaDTO);

    UnidadMedidaDTO delete(Long id);
}
