package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.CompraInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompraInsumoRepository extends JpaRepository<CompraInsumo, Long> {
}
