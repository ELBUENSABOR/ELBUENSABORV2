package com.utn.elbuensabor.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ReporteProductosVendidosDTO {
    private List<ProductoVendidoDTO> productosCocina;
    private List<ProductoVendidoDTO> bebidas;
}