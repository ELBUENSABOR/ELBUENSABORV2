package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.CategoriaArticuloInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaArticuloInsumoRepository extends JpaRepository<CategoriaArticuloInsumo, Long> {
}

