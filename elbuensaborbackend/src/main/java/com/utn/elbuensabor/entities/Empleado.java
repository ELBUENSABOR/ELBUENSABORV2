package com.utn.elbuensabor.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "empleado")
@Getter
@Setter
public class Empleado extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "usuario_id", unique = true)
    private Usuario usuario;

    private String nombre;
    private String apellido;
    private String telefono;
    private String email;

    @Enumerated(EnumType.STRING)
    private PerfilEmpleado perfilEmpleado;

    @OneToMany(mappedBy = "empleado")
    private List<PedidoVenta> pedidosVenta = new ArrayList<>();
}
