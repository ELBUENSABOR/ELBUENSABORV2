package com.utn.elbuensabor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.utn.elbuensabor.entities.NotaCredito;

public interface NotaCreditoRepository extends JpaRepository<NotaCredito, Long> {
    Optional<NotaCredito> findByFacturaId(Long facturaId);
}
