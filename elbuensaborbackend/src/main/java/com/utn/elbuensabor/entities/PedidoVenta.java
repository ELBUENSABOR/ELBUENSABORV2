package com.utn.elbuensabor.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pedido_venta")
@Getter
@Setter
public class PedidoVenta extends BaseEntity {

    private String numero;
    private LocalDateTime fechaPedido;
    private LocalDateTime horaEstimadaFinalizacion;
    private Double subTotal;
    private Double descuento;
    private Double gastosEnvio;
    private Double total;
    private Double totalCosto;
    private Boolean pagado = false;
    private String observaciones;
    private String direccionEntrega;
    private String telefonoEntrega;
    private Boolean stockDescontado = false;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "sucursal_id", nullable = false)
    private SucursalEmpresa sucursal;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    @Enumerated(EnumType.STRING)
    private TipoEnvio tipoEnvio;

    @Enumerated(EnumType.STRING)
    private FormaPago formaPago;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoVentaDetalle> detalles = new ArrayList<>();

    @OneToOne(mappedBy = "pedido")
    private FacturaVenta facturaVenta;

    @OneToOne(mappedBy = "pedido")
    private DatosMercadoPago datosMercadoPago;
}
