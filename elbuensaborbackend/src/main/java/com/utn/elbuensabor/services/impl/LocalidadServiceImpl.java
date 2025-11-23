package com.utn.elbuensabor.services.impl;

import java.util.List;

import com.utn.elbuensabor.dtos.LocalidadDTO;
import com.utn.elbuensabor.repositories.LocalidadRepository;
import com.utn.elbuensabor.services.LocalidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocalidadServiceImpl implements LocalidadService {

    private final LocalidadRepository localidadRepo;

    public List<LocalidadDTO> getAllLocalidades() {
        return localidadRepo.findAll()
                .stream()
                .map(l -> new LocalidadDTO(l.getId(), l.getNombre()))
                .toList();

    }
}
