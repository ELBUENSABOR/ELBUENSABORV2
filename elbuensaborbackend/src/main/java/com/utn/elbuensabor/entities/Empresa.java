package com.utn.elbuensabor.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "empresa")
@Getter
@Setter
public class Empresa extends BaseEntity {

    private String nombre;
    private String razonSocial;
    private Integer cuil;

    @OneToMany(mappedBy = "empresa")
    private List<SucursalEmpresa> sucursalesEmpresa;
}
