package com.utn.elbuensabor.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pais")
@Getter
@Setter
public class Pais extends BaseEntity {

    private String nombre;

    @OneToMany(mappedBy = "pais")
    private List<Provincia> provincias = new ArrayList<>();

}
