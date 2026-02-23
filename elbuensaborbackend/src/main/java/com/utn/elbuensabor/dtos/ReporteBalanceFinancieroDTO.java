package com.utn.elbuensabor.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReporteBalanceFinancieroDTO {
    private Double ingresos;
    private Double costos;
    private Double ganancias;
}