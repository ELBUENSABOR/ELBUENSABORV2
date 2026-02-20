package com.utn.elbuensabor.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "compra_insumo")
@Getter
@Setter
public class CompraInsumo extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "sucursal_id", nullable = false)
    private SucursalEmpresa sucursal;

    @ManyToOne
    @JoinColumn(name = "insumo_id", nullable = false)
    private ArticuloInsumo insumo;

    private Double cantidad;
    private Double precioCompra;
    private Double totalCompra;
    private LocalDateTime fechaCompra;
}
