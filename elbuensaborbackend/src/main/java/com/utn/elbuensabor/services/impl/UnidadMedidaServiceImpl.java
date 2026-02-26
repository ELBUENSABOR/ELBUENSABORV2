package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.dtos.UnidadMedidaDTO;
import com.utn.elbuensabor.entities.UnidadMedida;
import com.utn.elbuensabor.repositories.ArticuloInsumoRepository;
import com.utn.elbuensabor.repositories.UnidadMedidaRepository;
import com.utn.elbuensabor.services.UnidadMedidaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnidadMedidaServiceImpl implements UnidadMedidaService {

    private final UnidadMedidaRepository unidadMedidaRepository;
    private final ArticuloInsumoRepository articuloInsumoRepository;

    @Override
    public List<UnidadMedidaDTO> getAll() {
        return unidadMedidaRepository.findAllByActivoTrue().stream().map(this::toResponse).toList();
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
        boolean desactivar = !unidadMedidaDTO.activo() && unidadMedida.isActivo();
        validarDesactivacionSinInsumos(id, desactivar);
        unidadMedida.setDenominacion(unidadMedidaDTO.denominacion());
        unidadMedida.setActivo(unidadMedidaDTO.activo());
        unidadMedida = unidadMedidaRepository.save(unidadMedida);
        return toResponse(unidadMedida);
    }

    @Override
    public UnidadMedidaDTO delete(Long id) {
        UnidadMedida unidadMedida = unidadMedidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unidad no encontrada"));
        validarDesactivacionSinInsumos(id, unidadMedida.isActivo());
        unidadMedida.setActivo(false);
        unidadMedidaRepository.save(unidadMedida);
        return toResponse(unidadMedida);
    }

    private void validarDesactivacionSinInsumos(Long unidadMedidaId, boolean desactivar) {
        if (!desactivar) {
            return;
        }
        long cantidadInsumos = articuloInsumoRepository.countByUnidadMedidaId(unidadMedidaId);
        if (cantidadInsumos > 0) {
            throw new RuntimeException("No se puede desactivar la unidad de medida porque tiene "
                    + cantidadInsumos + " insumo(s) asociado(s)");
        }
    }

    public UnidadMedidaDTO toResponse(UnidadMedida unidadMedida) {
        return new UnidadMedidaDTO(
                unidadMedida.getId(),
                unidadMedida.getDenominacion(),
                unidadMedida.isActivo());
    }
}
