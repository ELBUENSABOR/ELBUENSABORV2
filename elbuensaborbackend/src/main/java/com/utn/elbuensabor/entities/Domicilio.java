package com.utn.elbuensabor.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "domicilio")
@Getter
@Setter
public class Domicilio extends BaseEntity {

    private String calle;
    private String numero;
    private Integer codigoPostal;

    @ManyToOne
    @JoinColumn(name = "localidad_id")
    private Localidad localidad;

    @OneToOne(mappedBy = "domicilio", cascade = CascadeType.ALL, orphanRemoval = true)
    private SucursalEmpresa sucursalEmpresa;
}
