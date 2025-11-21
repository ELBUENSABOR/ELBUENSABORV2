package com.utn.elbuensabor.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "categoria_articulo_manufacturado")
@Getter
@Setter
public class CategoriaArticuloManufacturado extends BaseEntity {

    private String denominacion;

    @OneToOne
    @JoinColumn(name = "articulo_manufacturado_id")
    private ArticuloManufacturado articuloManufacturado;
}
