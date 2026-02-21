package com.utn.elbuensabor.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.ArticuloManufacturadoDetalle;

@Repository
public interface ArticuloManufacturadoDetalleRepository extends JpaRepository<ArticuloManufacturadoDetalle, Long> {
    List<ArticuloManufacturadoDetalle> findByArticuloManufacturadoId(Long manufacturadoId);
}

