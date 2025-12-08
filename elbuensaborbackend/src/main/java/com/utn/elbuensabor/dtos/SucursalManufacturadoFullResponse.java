package com.utn.elbuensabor.dtos;

import java.util.List;

public record SucursalManufacturadoFullResponse(
        Long id,
        String denominacion,
        String descripcion,
        Double precioBase,
        Double precioSucursal,
        Boolean activo,
        List<RecetaItemResponse> receta
) {}
