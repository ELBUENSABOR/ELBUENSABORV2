package com.utn.elbuensabor.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "imagen_articulo_manufacturado")
@Getter
@Setter
public class ImagenArticuloManufacturado extends BaseEntity {

    @Lob
    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "articulo_manufacturado_id")
    private ArticuloManufacturado articuloManufacturado;
}
