package com.utn.elbuensabor.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
@Getter
@Setter
public class Usuario extends BaseEntity {

    private String auth0Id;
    private String username;
    private String password;
    private Boolean activo;
    @Lob
    @Column(name = "foto_perfil", columnDefinition = "LONGTEXT")
    private String fotoPerfil;

    @Column(name = "must_change_password")
    private Boolean mustChangePassword = false;

    @CreationTimestamp
    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;

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
