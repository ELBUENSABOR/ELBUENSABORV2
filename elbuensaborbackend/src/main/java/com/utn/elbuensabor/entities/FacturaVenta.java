package com.utn.elbuensabor.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "factura_venta")
@Getter
@Setter
public class FacturaVenta extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "pedido_id", unique = true, nullable = false)
    private PedidoVenta pedido;

    private LocalDateTime fechaFacturacion;
    private String numeroComprobante;

    @Enumerated(EnumType.STRING)
    private FormaPago formaPago;

    private Double subTotal;
    private Double descuento;
    private Double gastosEnvio;
    private Double totalVenta;
    private String pdfUrl;

    @OneToMany(mappedBy = "factura", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private List<FacturaVentaDetalle> detalles = new ArrayList<>();
}
