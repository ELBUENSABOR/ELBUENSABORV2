package com.utn.elbuensabor.dtos;

public record SucursalManufacturadoRequest(
        Long manufacturadoId,
        Double precioVentaSucursal,
        Boolean activo
) {}