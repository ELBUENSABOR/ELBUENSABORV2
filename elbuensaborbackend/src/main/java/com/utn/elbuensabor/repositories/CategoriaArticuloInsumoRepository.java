package com.utn.elbuensabor.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.CategoriaArticuloInsumo;

@Repository
public interface CategoriaArticuloInsumoRepository extends JpaRepository<CategoriaArticuloInsumo, Long> {
}

