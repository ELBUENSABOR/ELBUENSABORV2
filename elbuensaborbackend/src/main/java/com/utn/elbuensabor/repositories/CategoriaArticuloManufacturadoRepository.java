package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.CategoriaArticuloManufacturado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaArticuloManufacturadoRepository extends JpaRepository<CategoriaArticuloManufacturado, Long> {
}

