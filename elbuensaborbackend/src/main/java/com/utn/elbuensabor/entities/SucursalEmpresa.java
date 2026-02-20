package com.utn.elbuensabor.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sucursal_empresa")
@Getter
@Setter
public class SucursalEmpresa extends BaseEntity {

    private String nombre;
    private String horarioApertura;
    private String horarioCierre;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @OneToOne
    @JoinColumn(name = "domicilio_id")
    private Domicilio domicilio;

    @OneToMany(mappedBy = "sucursal")
    private List<SucursalInsumo> sucursalInsumos = new ArrayList<>();

    @OneToMany(mappedBy = "sucursal")
    private List<Usuario> usuarios = new ArrayList<>();
}
