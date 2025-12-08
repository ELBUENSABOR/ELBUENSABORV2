package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.SucursalManufacturado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SucursalManufacturadoRepository extends JpaRepository<SucursalManufacturado, Long> {

    List<SucursalManufacturado> findBySucursalId(Long sucursalId);

    Optional<SucursalManufacturado> findBySucursalIdAndManufacturadoId(Long sucursalId, Long manufacturadoId);
}

