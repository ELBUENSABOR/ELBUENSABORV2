package com.utn.elbuensabor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.utn.elbuensabor.entities.NotaCreditoVenta;

public interface NotaCreditoVentaRepository extends JpaRepository<NotaCreditoVenta, Long> {
    Optional<NotaCreditoVenta> findByPedidoId(Long pedidoId);
}