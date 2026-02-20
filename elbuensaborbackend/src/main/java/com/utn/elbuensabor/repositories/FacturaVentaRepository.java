package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.FacturaVenta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacturaVentaRepository extends JpaRepository<FacturaVenta, Long> {
    Optional<FacturaVenta> findByPedidoId(Long pedidoId);
}