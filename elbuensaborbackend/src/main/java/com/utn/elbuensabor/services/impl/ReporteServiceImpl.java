package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.dtos.ProductoVendidoDTO;
import com.utn.elbuensabor.dtos.ReporteClientesPedidosDTO;
import com.utn.elbuensabor.dtos.ReporteProductosVendidosDTO;
import com.utn.elbuensabor.repositories.PedidoVentaDetalleRepository;
import com.utn.elbuensabor.repositories.PedidoVentaRepository;
import com.utn.elbuensabor.services.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteServiceImpl implements ReporteService {

    private final PedidoVentaDetalleRepository pedidoVentaDetalleRepository;
    private final PedidoVentaRepository pedidoVentaRepository;

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

    @Override
    public List<ReporteClientesPedidosDTO> obtenerClientesPorPedidos(LocalDate desde, LocalDate hasta, String orden) {
        LocalDate fechaInicio = desde;
        LocalDate fechaFin = hasta;
        if (fechaInicio.isAfter(fechaFin)) {
            fechaInicio = hasta;
            fechaFin = desde;
        }

        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.atTime(LocalTime.MAX);

        List<ReporteClientesPedidosDTO> reportes = new ArrayList<>(
                pedidoVentaRepository.findReporteClientesPedidos(inicio, fin));

        Comparator<ReporteClientesPedidosDTO> comparator;
        if ("TOTAL".equalsIgnoreCase(orden)) {
            comparator = Comparator.comparing(ReporteClientesPedidosDTO::getTotalPedidos);
        } else {
            comparator = Comparator.comparing(ReporteClientesPedidosDTO::getCantidadPedidos);
        }

        reportes.sort(comparator.reversed()
                .thenComparing(ReporteClientesPedidosDTO::getApellido, String.CASE_INSENSITIVE_ORDER)
                .thenComparing(ReporteClientesPedidosDTO::getNombre, String.CASE_INSENSITIVE_ORDER));

        return reportes;
    }
}