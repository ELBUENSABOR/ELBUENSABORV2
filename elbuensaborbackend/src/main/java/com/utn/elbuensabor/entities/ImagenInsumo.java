package com.utn.elbuensabor.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "imagen_insumo")
@Getter 
@Setter
public class ImagenInsumo extends BaseEntity {

    @Lob
    @Column(columnDefinition = "TEXT")
    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "articulo_insumo_id")
    private ArticuloInsumo articuloInsumo;

}
