package com.utn.elbuensabor.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "nota_credito_venta")
@Getter
@Setter
public class NotaCreditoVenta extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "pedido_id", unique = true, nullable = false)
    private PedidoVenta pedido;

    @OneToOne
    @JoinColumn(name = "factura_original_id", unique = true, nullable = false)
    private FacturaVenta facturaOriginal;

    private LocalDateTime fechaEmision;
    private String numeroComprobante;
    private Double total;
    private String pdfUrl;
}