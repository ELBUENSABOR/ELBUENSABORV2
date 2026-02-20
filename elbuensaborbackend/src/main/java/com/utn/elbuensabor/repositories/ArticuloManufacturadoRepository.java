package com.utn.elbuensabor.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.ArticuloManufacturado;

@Repository
public interface ArticuloManufacturadoRepository extends JpaRepository<ArticuloManufacturado, Long> {
    Optional<ArticuloManufacturado> findByIdAndActivoTrue(Long id);

    List<ArticuloManufacturado> findByActivoTrue();

    List<ArticuloManufacturado> findByActivo(Boolean activo);
}
