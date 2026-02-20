package com.utn.elbuensabor.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "provincia")
@Getter
@Setter
public class Provincia extends BaseEntity {

    private String nombre;

    @ManyToOne()
    @JoinColumn(name = "pais_id")
    private Pais pais;

    @OneToMany(mappedBy = "provincia")
    private List<Localidad> localidades = new ArrayList<>();

}
