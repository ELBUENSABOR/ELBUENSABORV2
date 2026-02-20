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
