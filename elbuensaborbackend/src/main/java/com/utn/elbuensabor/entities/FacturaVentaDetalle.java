package com.utn.elbuensabor.entities;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "factura_venta_detalle")
@Getter
@Setter
public class FacturaVentaDetalle extends BaseEntity {

    private Integer cantidad;
    private BigDecimal subTotal;

    @ManyToOne
    @JoinColumn(name = "factura_id")
    private FacturaVenta factura;

    @ManyToOne
    @JoinColumn(name = "articulo_insumo_id")
    private ArticuloInsumo articuloInsumo;

    @ManyToOne
    @JoinColumn(name = "articulo_manufacturado_id")
    private ArticuloManufacturado articuloManufacturado;
}
