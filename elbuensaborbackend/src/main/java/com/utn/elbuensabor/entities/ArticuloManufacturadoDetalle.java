package com.utn.elbuensabor.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articulo_manufacturado_detalle")
@Getter
@Setter
public class ArticuloManufacturadoDetalle extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "articulo_manufacturado_id")
    private ArticuloManufacturado articuloManufacturado;

    @ManyToOne
    @JoinColumn(name = "articulo_insumo_id")
    private ArticuloInsumo articuloInsumo;

    private Double cantidad;
}
