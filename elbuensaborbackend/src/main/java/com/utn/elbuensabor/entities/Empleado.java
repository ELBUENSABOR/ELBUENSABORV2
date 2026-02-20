package com.utn.elbuensabor.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

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
