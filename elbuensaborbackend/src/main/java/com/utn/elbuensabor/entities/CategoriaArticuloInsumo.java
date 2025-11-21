package com.utn.elbuensabor.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "categoria_articulo_insumo")
@Getter
@Setter
public class CategoriaArticuloInsumo extends BaseEntity {

    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "categoria_padre_id")
    private CategoriaArticuloInsumo categoriaPadre;

    @OneToMany(mappedBy = "categoriaPadre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CategoriaArticuloInsumo> subCategorias = new ArrayList<>();

    @OneToMany(mappedBy = "categoriaArticuloInsumo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticuloInsumo> articulosInsumo = new ArrayList<>();
}
