package com.utn.elbuensabor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.ArticuloManufacturado;

@Repository
public interface ArticuloManufacturadoRepository extends JpaRepository<ArticuloManufacturado, Long> {
    Optional<ArticuloManufacturado> findByIdAndActivoTrue(Long id);
}

