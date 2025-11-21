package com.utn.elbuensabor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.Pais;

@Repository
public interface PaisRepository extends JpaRepository<Pais, Long> {

    Optional<Pais> findByNombre(String nombre);

    boolean existsByNombre(String nombre);

}
