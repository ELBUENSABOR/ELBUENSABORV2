package com.utn.elbuensabor.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pedido_venta_detalle")
@Getter
@Setter
public class PedidoVentaDetalle extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private PedidoVenta pedido;

    @ManyToOne
    @JoinColumn(name = "manufacturado_id")
    private ArticuloManufacturado manufacturado;

    @ManyToOne
    @JoinColumn(name = "insumo_id")
    private ArticuloInsumo insumo;

    private Integer cantidad;
    private Double precioUnit;
    private Double subTotal;
}
