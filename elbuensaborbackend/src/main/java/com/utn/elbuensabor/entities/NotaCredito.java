package com.utn.elbuensabor.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "nota_credito")
@Getter
@Setter
public class NotaCredito extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "factura_id", unique = true, nullable = false)
    private FacturaVenta factura;

    private LocalDateTime fechaEmision;
    private String numeroComprobante;
    private String motivo;
    private Double subTotal;
    private Double descuento;
    private Double gastosEnvio;
    private Double total;

    @OneToMany(mappedBy = "notaCredito", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotaCreditoDetalle> detalles = new ArrayList<>();
}
