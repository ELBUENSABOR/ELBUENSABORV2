package com.utn.elbuensabor.services;

import java.time.LocalDate;
import java.util.List;

import com.utn.elbuensabor.dtos.ReporteProductosVendidosDTO;
import com.utn.elbuensabor.dtos.ReporteClientesPedidosDTO;

public interface ReporteService {
    ReporteProductosVendidosDTO obtenerProductosMasVendidos(LocalDate desde, LocalDate hasta);

    List<ReporteClientesPedidosDTO> obtenerClientesPorPedidos(LocalDate desde, LocalDate hasta, String orden);
}