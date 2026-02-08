package com.utn.elbuensabor.services.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.utn.elbuensabor.dtos.ProductoVendidoDTO;
import com.utn.elbuensabor.dtos.ReporteProductosVendidosDTO;
import com.utn.elbuensabor.repositories.PedidoVentaDetalleRepository;
import com.utn.elbuensabor.services.ReporteService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReporteServiceImpl implements ReporteService {

    private final PedidoVentaDetalleRepository pedidoVentaDetalleRepository;

    @Override
    public ReporteProductosVendidosDTO obtenerProductosMasVendidos(LocalDate desde, LocalDate hasta) {
        LocalDate fechaInicio = desde;
        LocalDate fechaFin = hasta;
        if (fechaInicio.isAfter(fechaFin)) {
            fechaInicio = hasta;
            fechaFin = desde;
        }

        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.atTime(LocalTime.MAX);

        List<ProductoVendidoDTO> productosCocina = pedidoVentaDetalleRepository
                .findTopManufacturados(inicio, fin);
        List<ProductoVendidoDTO> bebidas = pedidoVentaDetalleRepository
                .findTopBebidas(inicio, fin);

        return new ReporteProductosVendidosDTO(productosCocina, bebidas);
    }
}