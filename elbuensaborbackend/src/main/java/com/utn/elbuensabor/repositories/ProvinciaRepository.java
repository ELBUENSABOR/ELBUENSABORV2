package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProvinciaRepository extends JpaRepository<Provincia, Long> {

    Optional<Provincia> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
