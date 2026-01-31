package com.utn.elbuensabor.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "articulo_manufacturado")
public class ArticuloManufacturado extends BaseEntity {

    private String denominacion;
    private String descripcion;
    private String receta;
    private Double precioVenta;
    private Double precioCosto;
    private Integer tiempoEstimado;
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "categoria_articulo_manufacturado_id", nullable = false)
    private CategoriaArticuloManufacturado categoria;

    @OneToMany(mappedBy = "articuloManufacturado", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticuloManufacturadoDetalle> articuloManufacturadoDetalles = new ArrayList<>();

    @OneToMany(mappedBy = "articuloManufacturado", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImagenArticuloManufacturado> imagenes = new ArrayList<>();
}
