package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.ReporteClientesPedidosDTO;
import com.utn.elbuensabor.dtos.ReporteProductosVendidosDTO;

import java.time.LocalDate;
import java.util.List;

public interface ReporteService {
    ReporteProductosVendidosDTO obtenerProductosMasVendidos(LocalDate desde, LocalDate hasta);

    List<ReporteClientesPedidosDTO> obtenerClientesPorPedidos(LocalDate desde, LocalDate hasta, String orden);
}