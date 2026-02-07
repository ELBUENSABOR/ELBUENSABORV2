package com.utn.elbuensabor.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.entities.FacturaVentaDetalle;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.entities.PedidoVentaDetalle;
import com.utn.elbuensabor.repositories.FacturaVentaRepository;
import com.utn.elbuensabor.services.FacturaService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacturaServiceImpl implements FacturaService {

    private final FacturaVentaRepository facturaVentaRepository;

    @Transactional
    public FacturaVenta generarFactura(PedidoVenta pedido) {
        FacturaVenta factura = new FacturaVenta();
        factura.setPedido(pedido);
        factura.setFechaFacturacion(LocalDateTime.now());
        factura.setNumeroComprobante(generarNumeroComprobante());
        factura.setFormaPago(pedido.getFormaPago());
        factura.setSubTotal(pedido.getSubTotal());
        factura.setDescuento(pedido.getDescuento());
        factura.setGastosEnvio(pedido.getGastosEnvio());
        factura.setTotalVenta(pedido.getTotal());

        for (PedidoVentaDetalle detalle : pedido.getDetalles()) {
            FacturaVentaDetalle detalleFactura = new FacturaVentaDetalle();
            detalleFactura.setFactura(factura);
            detalleFactura.setCantidad(detalle.getCantidad());
            detalleFactura.setSubTotal(BigDecimal.valueOf(detalle.getSubTotal()));
            if (detalle.getManufacturado() != null) {
                detalleFactura.setArticuloManufacturado(detalle.getManufacturado());
            } else if (detalle.getInsumo() != null) {
                detalleFactura.setArticuloInsumo(detalle.getInsumo());
            }
            factura.getDetalles().add(detalleFactura);
        }

        return facturaVentaRepository.save(factura);
    }

    private String generarNumeroComprobante() {
        LocalDateTime now = LocalDateTime.now();
        String fecha = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String hora = now.format(java.time.format.DateTimeFormatter.ofPattern("HHmmss"));
        String random = String.format("%04d", (int) (Math.random() * 10000));
        return "FAC-" + fecha + "-" + hora + "-" + random;
    }
}