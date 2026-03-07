package com.utn.elbuensabor.dtos;

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
        java.util.List<SucursalInsumoRequest> stockSucursal,
        String imagen
) {
}

