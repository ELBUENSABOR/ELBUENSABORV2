package com.utn.elbuensabor.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.SucursalInsumo;

@Repository
public interface SucursalInsumoRepository extends JpaRepository<SucursalInsumo, Long> {

    Optional<SucursalInsumo> findBySucursalIdAndInsumoId(Long sucursalId, Long insumoId);

    List<SucursalInsumo> findBySucursalId(Long sucursalId);

    @Query("SELECT s FROM SucursalInsumo s WHERE s.sucursal.id = :sucursalId AND s.stockActual <= s.stockMinimo")
    List<SucursalInsumo> findStockBajoMinimo(@Param("sucursalId") Long sucursalId);

    @Query("SELECT s FROM SucursalInsumo s WHERE s.sucursal.id = :sucursalId AND s.stockActual > s.stockMinimo AND s.stockActual <= (s.stockMinimo * 1.2)")
    List<SucursalInsumo> findStockCercaMinimo(@Param("sucursalId") Long sucursalId);
}

