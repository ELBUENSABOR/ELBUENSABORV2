package com.utn.elbuensabor.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.CategoriaArticuloManufacturado;

@Repository
public interface CategoriaArticuloManufacturadoRepository extends JpaRepository<CategoriaArticuloManufacturado, Long> {
}

