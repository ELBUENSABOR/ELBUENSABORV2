package com.utn.elbuensabor.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.PedidoVentaDetalle;

@Repository
public interface PedidoVentaDetalleRepository extends JpaRepository<PedidoVentaDetalle, Long> {
}

