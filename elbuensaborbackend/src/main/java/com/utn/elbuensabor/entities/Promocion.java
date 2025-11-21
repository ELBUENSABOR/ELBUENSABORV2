package com.utn.elbuensabor.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "promocion")
@Getter
@Setter
public class Promocion extends BaseEntity {

    private String denominacion;
    private LocalDateTime fechaDesde;
    private LocalDateTime fechaHasta;
    private Double descuento;

    @OneToMany(mappedBy = "promocion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PromocionDetalle> promocionDetalles = new ArrayList<>();
}
