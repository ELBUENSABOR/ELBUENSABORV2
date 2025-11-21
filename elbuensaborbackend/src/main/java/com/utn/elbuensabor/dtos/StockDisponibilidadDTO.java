package com.utn.elbuensabor.dtos;

public record StockDisponibilidadDTO(
        Long articuloId,
        String tipo, // "MANUFACTURADO" o "INSUMO"
        String denominacion,
        Boolean disponible,
        Double stockActual,
        String mensaje
) {
}

