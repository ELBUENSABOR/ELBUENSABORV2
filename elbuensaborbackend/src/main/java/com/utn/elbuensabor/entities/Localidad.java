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
@Getter
@Setter
@Table(name = "localidad")
public class Localidad extends BaseEntity {

    private String nombre;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name = "provincia_id")
    private Provincia provincia;

    @OneToMany(mappedBy = "localidad")
    private List<Domicilio> domicilios = new ArrayList<>();

}
