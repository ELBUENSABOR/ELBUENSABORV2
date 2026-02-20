package com.utn.elbuensabor.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReporteClientesPedidosDTO {
    private Long clienteId;
    private String nombre;
    private String apellido;
    private String email;
    private Long cantidadPedidos;
    private Double totalPedidos;
}