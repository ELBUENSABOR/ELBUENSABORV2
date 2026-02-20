package com.utn.elbuensabor.entities;

import jakarta.persistence.*;
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
