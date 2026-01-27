package com.utn.elbuensabor.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "imagen_insumo")
@Getter 
@Setter
public class ImagenInsumo extends BaseEntity {

    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "articulo_insumo_id")
    private ArticuloInsumo articuloInsumo;

}
