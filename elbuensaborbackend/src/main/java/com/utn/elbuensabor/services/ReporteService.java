package com.utn.elbuensabor.services;

import java.time.LocalDate;

import com.utn.elbuensabor.dtos.ReporteProductosVendidosDTO;

public interface ReporteService {
    ReporteProductosVendidosDTO obtenerProductosMasVendidos(LocalDate desde, LocalDate hasta);
}