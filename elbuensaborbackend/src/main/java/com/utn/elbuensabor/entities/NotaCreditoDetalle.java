package com.utn.elbuensabor.entities;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "nota_credito_detalle")
@Getter
@Setter
public class NotaCreditoDetalle extends BaseEntity {

    private Integer cantidad;
    private BigDecimal subTotal;

    @ManyToOne
    @JoinColumn(name = "nota_credito_id", nullable = false)
    private NotaCredito notaCredito;

    @ManyToOne
    @JoinColumn(name = "articulo_insumo_id")
    private ArticuloInsumo articuloInsumo;

    @ManyToOne
    @JoinColumn(name = "articulo_manufacturado_id")
    private ArticuloManufacturado articuloManufacturado;
}
