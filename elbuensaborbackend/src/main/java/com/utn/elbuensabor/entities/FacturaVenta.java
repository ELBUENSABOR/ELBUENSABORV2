package com.utn.elbuensabor.entities;

import java.time.LocalDateTime;
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
