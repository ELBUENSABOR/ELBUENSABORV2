package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.Localidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Long> {
    Optional<Localidad> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
