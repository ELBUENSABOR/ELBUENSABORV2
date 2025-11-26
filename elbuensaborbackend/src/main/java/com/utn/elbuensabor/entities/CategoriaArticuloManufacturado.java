package com.utn.elbuensabor.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categoria_articulo_manufacturado")
@Getter
@Setter
public class CategoriaArticuloManufacturado extends BaseEntity {

    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "categoria_padre_id")
    private CategoriaArticuloManufacturado categoriaPadre;

    @OneToOne
    @JoinColumn(name = "articulo_manufacturado_id")
    private ArticuloManufacturado articuloManufacturado;

    @OneToMany(mappedBy = "categoriaPadre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CategoriaArticuloManufacturado> subCategorias = new ArrayList<>();
}
