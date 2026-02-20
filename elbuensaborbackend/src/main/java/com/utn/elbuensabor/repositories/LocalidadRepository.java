package com.utn.elbuensabor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.Localidad;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Long>{
    Optional<Localidad> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
