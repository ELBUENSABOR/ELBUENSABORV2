package com.utn.elbuensabor.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProductoVendidoDTO {
    private String nombre;
    private Long cantidad;
}