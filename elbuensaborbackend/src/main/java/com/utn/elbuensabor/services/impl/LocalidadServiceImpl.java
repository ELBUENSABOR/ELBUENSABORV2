package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.dtos.LocalidadDTO;
import com.utn.elbuensabor.repositories.LocalidadRepository;
import com.utn.elbuensabor.services.LocalidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
