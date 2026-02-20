package com.utn.elbuensabor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.ArticuloInsumo;

@Repository
public interface ArticuloInsumoRepository extends JpaRepository<ArticuloInsumo, Long> {
    Optional<ArticuloInsumo> findByIdAndActivoTrue(Long id);
}

