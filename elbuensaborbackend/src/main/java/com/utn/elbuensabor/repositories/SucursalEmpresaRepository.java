package com.utn.elbuensabor.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.SucursalEmpresa;

@Repository
public interface SucursalEmpresaRepository extends JpaRepository<SucursalEmpresa, Long> {
}

