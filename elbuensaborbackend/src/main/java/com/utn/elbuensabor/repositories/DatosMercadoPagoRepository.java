package com.utn.elbuensabor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.utn.elbuensabor.entities.DatosMercadoPago;

public interface DatosMercadoPagoRepository extends JpaRepository<DatosMercadoPago, Long> {
    Optional<DatosMercadoPago> findByPedidoId(Long pedidoId);
}