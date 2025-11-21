package com.utn.elbuensabor.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "datos_mercadopago")
@Getter
@Setter
public class DatosMercadoPago extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "pedido_id", unique = true, nullable = false)
    private PedidoVenta pedido;

    private LocalDateTime dateCreated;
    private LocalDateTime dateApproved;
    private LocalDateTime dateLastUpdated;
    private String paymentTypeId;
    private String paymentMethodId;
    private String status;
    private String statusDetail;
    private String paymentId;
}
