package com.utn.elbuensabor.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
public class Usuario extends BaseEntity {

    private String auth0Id;
    private String username;
    private String password;
    private Boolean activo;

    @Enumerated(EnumType.STRING)
    private RolSistema rolSistema;

    @OneToOne(mappedBy = "usuario")
    private Cliente cliente;

    @OneToOne(mappedBy = "usuario")
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "sucursal_id")
    private SucursalEmpresa sucursal;

}
