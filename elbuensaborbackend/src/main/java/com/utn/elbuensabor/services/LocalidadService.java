package com.utn.elbuensabor.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.utn.elbuensabor.dtos.LocalidadDTO;
import com.utn.elbuensabor.repositories.LocalidadRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocalidadService {

    private final LocalidadRepository localidadRepo;

    public List<LocalidadDTO> getAllLocalidades() {
        return localidadRepo.findAll()
                .stream()
                .map(l -> new LocalidadDTO(l.getId(), l.getNombre()))
                .toList();

    }
}
