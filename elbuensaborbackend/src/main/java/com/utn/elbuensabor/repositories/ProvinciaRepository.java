package com.utn.elbuensabor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.Provincia;

@Repository
public interface ProvinciaRepository extends JpaRepository<Provincia, Long> {

    Optional<Provincia> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
