package com.utn.elbuensabor.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "localidad")
public class Localidad extends BaseEntity {

    private String nombre;

    @ManyToOne()
    @JoinColumn(name = "provincia_id")
    private Provincia provincia;

    @OneToMany(mappedBy = "localidad")
    private List<Domicilio> domicilios = new ArrayList<>();

}
