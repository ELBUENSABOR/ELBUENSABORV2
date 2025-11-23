package com.utn.elbuensabor.services;

import java.util.List;

import org.springframework.stereotype.Service;
import com.utn.elbuensabor.dtos.LocalidadDTO;
import com.utn.elbuensabor.repositories.LocalidadRepository;
import lombok.RequiredArgsConstructor;


public interface LocalidadService {

    List<LocalidadDTO> getAllLocalidades();
}
