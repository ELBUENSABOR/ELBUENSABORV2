package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.ArticuloInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticuloInsumoRepository extends JpaRepository<ArticuloInsumo, Long> {
    Optional<ArticuloInsumo> findByIdAndActivoTrue(Long id);
}

