package com.utn.elbuensabor.dtos;

public record StockAlertaDTO(
        Long insumoId,
        String denominacion,
        Double stockActual,
        Double stockMinimo,
        String nivel) {

}

