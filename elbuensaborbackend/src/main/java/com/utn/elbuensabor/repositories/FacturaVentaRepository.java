package com.utn.elbuensabor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.utn.elbuensabor.entities.FacturaVenta;

public interface FacturaVentaRepository extends JpaRepository<FacturaVenta, Long> {
    Optional<FacturaVenta> findByPedidoId(Long pedidoId);
}