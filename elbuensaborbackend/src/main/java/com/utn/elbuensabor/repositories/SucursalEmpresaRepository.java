package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.SucursalEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SucursalEmpresaRepository extends JpaRepository<SucursalEmpresa, Long> {
}

