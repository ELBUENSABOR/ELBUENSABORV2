package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.Pais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaisRepository extends JpaRepository<Pais, Long> {

    Optional<Pais> findByNombre(String nombre);

    boolean existsByNombre(String nombre);

}
