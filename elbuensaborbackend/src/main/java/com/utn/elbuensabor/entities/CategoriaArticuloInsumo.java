package com.utn.elbuensabor.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categoria_articulo_insumo")
@Getter
@Setter
public class CategoriaArticuloInsumo extends BaseEntity {

    private String denominacion;

    private boolean activo;

    @ManyToOne
    @JoinColumn(name = "categoria_padre_id")
    private CategoriaArticuloInsumo categoriaPadre;

    @OneToMany(mappedBy = "categoriaPadre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CategoriaArticuloInsumo> subCategorias = new ArrayList<>();

    @OneToMany(mappedBy = "categoriaArticuloInsumo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticuloInsumo> articulosInsumo = new ArrayList<>();
}
