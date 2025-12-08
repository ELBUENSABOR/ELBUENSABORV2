package com.utn.elbuensabor.dtos;

public record SucursalManufacturadoResponse(
        Long manufacturadoId,
        String nombre,
        Double precioBase,
        Double precioSucursal,
        Boolean activo
) {}
