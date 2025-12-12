package com.utn.elbuensabor.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "unidad_medida")
@Getter
@Setter
public class UnidadMedida extends BaseEntity {

    private String denominacion;
    private boolean activo;

}
