package com.utn.elbuensabor.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "articulo_manufacturado")
public class ArticuloManufacturado extends BaseEntity {

    private String denominacion;
    private String descripcion;
    private Double precioVenta;
    private Double precioCosto;
    private Integer tiempoEstimado;
    private Boolean activo = true;

    @OneToOne
    @JoinColumn(name = "categoria_articulo_manufacturado_id")
    private CategoriaArticuloManufacturado categoria;

    @OneToMany(mappedBy = "articuloManufacturado", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticuloManufacturadoDetalle> articuloManufacturadoDetalles = new ArrayList<>();

    @OneToMany(mappedBy = "articuloManufacturado", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImagenArticuloManufacturado> imagenes = new ArrayList<>();

    @OneToMany(mappedBy = "manufacturado")
    private List<SucursalManufacturado> sucursalConfig = new ArrayList<>();
}
