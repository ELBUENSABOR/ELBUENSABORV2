package com.utn.elbuensabor.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.EstadoPedido;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.dtos.ReporteBalanceFinancieroDTO;
import com.utn.elbuensabor.dtos.ReporteClientesPedidosDTO;

@Repository
public interface PedidoVentaRepository extends JpaRepository<PedidoVenta, Long> {

    Optional<PedidoVenta> findByNumero(String numero);

    List<PedidoVenta> findByClienteId(Long clienteId);

    List<PedidoVenta> findByEstado(EstadoPedido estado);

    List<PedidoVenta> findByClienteIdAndEstado(Long clienteId, EstadoPedido estado);

    @Query("SELECT p FROM PedidoVenta p LEFT JOIN FETCH p.facturaVenta fv LEFT JOIN FETCH p.detalles d LEFT JOIN FETCH d.manufacturado LEFT JOIN FETCH d.insumo WHERE p.id = :id")
    Optional<PedidoVenta> findByIdWithDetalles(@Param("id") Long id);

    @Query("SELECT p FROM PedidoVenta p LEFT JOIN FETCH p.facturaVenta fv LEFT JOIN FETCH p.detalles d LEFT JOIN FETCH d.manufacturado LEFT JOIN FETCH d.insumo WHERE p.cliente.id = :clienteId")
    List<PedidoVenta> findByClienteIdWithDetalles(@Param("clienteId") Long clienteId);

    @Query("SELECT p FROM PedidoVenta p LEFT JOIN FETCH p.facturaVenta fv LEFT JOIN FETCH p.detalles d LEFT JOIN FETCH d.manufacturado LEFT JOIN FETCH d.insumo WHERE p.estado = :estado")
    List<PedidoVenta> findByEstadoWithDetalles(@Param("estado") EstadoPedido estado);

    @Query("SELECT p FROM PedidoVenta p LEFT JOIN FETCH p.facturaVenta fv LEFT JOIN FETCH p.detalles d LEFT JOIN FETCH d.manufacturado LEFT JOIN FETCH d.insumo WHERE p.estado = :estado AND p.sucursal.id = :sucursalId")
    List<PedidoVenta> findByEstadoAndSucursalIdWithDetalles(@Param("estado") EstadoPedido estado, @Param("sucursalId") Long sucursalId);

    @Query("SELECT p FROM PedidoVenta p WHERE p.fechaPedido BETWEEN :fechaInicio AND :fechaFin")
    List<PedidoVenta> findByFechaPedidoBetween(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);

    @Query("SELECT p FROM PedidoVenta p LEFT JOIN FETCH p.facturaVenta fv LEFT JOIN FETCH p.detalles d LEFT JOIN FETCH d.manufacturado LEFT JOIN FETCH d.insumo WHERE p.sucursal.id = :sucursalId")
    List<PedidoVenta> findBySucursalIdWithDetalles(@Param("sucursalId") Long sucursalId);
    @Query("""
        SELECT new com.utn.elbuensabor.dtos.ReporteClientesPedidosDTO(
            c.id,
            c.nombre,
            c.apellido,
            c.email,
            COUNT(p),
            COALESCE(SUM(p.total), 0)
        )
        FROM PedidoVenta p
        JOIN p.cliente c
        WHERE p.fechaPedido BETWEEN :fechaInicio AND :fechaFin
        GROUP BY c.id, c.nombre, c.apellido, c.email
        """)
    List<ReporteClientesPedidosDTO> findReporteClientesPedidos(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);
    @Query("""
            SELECT new com.utn.elbuensabor.dtos.ReporteBalanceFinancieroDTO(
                COALESCE(SUM(p.total), 0),
                COALESCE(SUM(p.totalCosto), 0),
                COALESCE(SUM(p.total), 0) - COALESCE(SUM(p.totalCosto), 0)
            )
            FROM PedidoVenta p
            WHERE p.fechaPedido BETWEEN :fechaInicio AND :fechaFin
            """)
    ReporteBalanceFinancieroDTO findBalanceFinanciero(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);
}

