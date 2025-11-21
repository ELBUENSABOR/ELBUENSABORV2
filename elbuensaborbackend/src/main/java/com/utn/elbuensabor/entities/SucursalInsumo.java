package com.utn.elbuensabor.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sucursal_insumo", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"sucursal_id", "insumo_id"}))
@Getter
@Setter
public class SucursalInsumo extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "sucursal_id", nullable = false)
    private SucursalEmpresa sucursal;

    @ManyToOne
    @JoinColumn(name = "insumo_id", nullable = false)
    private ArticuloInsumo insumo;

    private Double stockActual = 0.0;
    private Double stockMinimo = 0.0;
    private Double stockMaximo = 0.0;
}
