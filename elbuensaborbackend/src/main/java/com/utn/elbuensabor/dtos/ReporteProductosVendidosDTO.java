package com.utn.elbuensabor.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReporteProductosVendidosDTO {
    private List<ProductoVendidoDTO> productosCocina;
    private List<ProductoVendidoDTO> bebidas;
}