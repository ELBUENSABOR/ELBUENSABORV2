package com.utn.elbuensabor.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sucursal_manufacturado")
@Getter
@Setter
public class SucursalManufacturado extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "sucursal_id", nullable = false)
    private SucursalEmpresa sucursal;

    @ManyToOne
    @JoinColumn(name = "manufacturado_id", nullable = false)
    private ArticuloManufacturado manufacturado;

    private Double precioVentaSucursal;

    private Boolean activo = true;
}
