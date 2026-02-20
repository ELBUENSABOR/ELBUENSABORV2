package com.utn.elbuensabor.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articulo_insumo")
@Getter
@Setter
public class ArticuloInsumo extends BaseEntity {

    private String denominacion;
    private Double precioCompra;
    private Double precioVenta;
    private Boolean esParaElaborar;

    @ManyToOne
    @JoinColumn(name = "categoria_articulo_id")
    private CategoriaArticuloInsumo categoriaArticuloInsumo;

    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "unidad_medida_id")
    private UnidadMedida unidadMedida;

    @OneToMany(mappedBy = "articuloInsumo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImagenInsumo> imagenes = new ArrayList<>();

    @OneToMany(mappedBy = "insumo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SucursalInsumo> stockSucursal = new ArrayList<>();
}
