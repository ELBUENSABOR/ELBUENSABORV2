package com.utn.elbuensabor.dtos;

import com.utn.elbuensabor.entities.CategoriaArticuloInsumo;
import com.utn.elbuensabor.entities.UnidadMedida;

import java.util.List;

public record ArticuloInsumoResponse(
        Long id,
        String denominacion,
        String descripcion,
        Double precioVenta,
        Double precioCompra,
        Integer tiempoEstimado,
        CategoriaResponse categoria,
        Boolean esParaElaborar,
        Boolean activo,
        UnidadMedidaDTO unidadMedida,
        List<SucursalInsumoRequest> stockSucursal
) {
}

