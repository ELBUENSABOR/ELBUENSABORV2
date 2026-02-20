package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.dtos.ProductoVendidoDTO;
import com.utn.elbuensabor.entities.PedidoVentaDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PedidoVentaDetalleRepository extends JpaRepository<PedidoVentaDetalle, Long> {
    @Query("""
            select new com.utn.elbuensabor.dtos.ProductoVendidoDTO(
                d.manufacturado.denominacion,
                sum(d.cantidad)
            )
            from PedidoVentaDetalle d
            join d.pedido p
            join d.manufacturado m
            join m.categoria c
            left join c.categoriaPadre cp
            where d.manufacturado is not null
              and not (
                lower(c.denominacion) in ('bebidas', 'bebida')
                or lower(cp.denominacion) in ('bebidas', 'bebida')
              )
              and p.fechaPedido between :desde and :hasta
            group by d.manufacturado.denominacion
            order by sum(d.cantidad) desc
            """)
    List<ProductoVendidoDTO> findTopManufacturados(@Param("desde") LocalDateTime desde,
                                                   @Param("hasta") LocalDateTime hasta);

    @Query("""
            select new com.utn.elbuensabor.dtos.ProductoVendidoDTO(
                d.manufacturado.denominacion,
                sum(d.cantidad)
            )
            from PedidoVentaDetalle d
            join d.pedido p
            join d.manufacturado m
            join m.categoria c
            left join c.categoriaPadre cp
            where d.manufacturado is not null
              and (
                lower(c.denominacion) in ('bebidas', 'bebida')
                or lower(cp.denominacion) in ('bebidas', 'bebida')
              )
              and p.fechaPedido between :desde and :hasta
            group by d.manufacturado.denominacion
            order by sum(d.cantidad) desc
            """)
    List<ProductoVendidoDTO> findTopBebidas(@Param("desde") LocalDateTime desde,
                                            @Param("hasta") LocalDateTime hasta);
}