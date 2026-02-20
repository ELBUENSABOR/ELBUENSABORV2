package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.DatosMercadoPago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DatosMercadoPagoRepository extends JpaRepository<DatosMercadoPago, Long> {
    Optional<DatosMercadoPago> findByPedidoId(Long pedidoId);
}