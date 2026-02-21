package com.utn.elbuensabor.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.entities.FacturaVentaDetalle;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.entities.PedidoVentaDetalle;
import com.utn.elbuensabor.repositories.FacturaVentaRepository;
import com.utn.elbuensabor.services.FacturaService;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FacturaServiceImpl implements FacturaService {

    private final FacturaVentaRepository facturaVentaRepository;
    private final FacturaPdfTemplateRenderer facturaPdfTemplateRenderer;

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
        if (pedido.getDatosMercadoPago() != null && pedido.getDatosMercadoPago().getPaymentId() != null) {
            factura.setPaymentId(pedido.getDatosMercadoPago().getPaymentId());
        }

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

        factura = facturaVentaRepository.save(factura);
        factura.setPdfUrl(generarPdfFactura(factura));
        return facturaVentaRepository.save(factura);
    }

    private String generarPdfFactura(FacturaVenta factura) {
        Path dir = Path.of("uploads", "facturas");
        try {
            Files.createDirectories(dir);
            String fileName = String.format("factura-%d.pdf", factura.getId());
            Path filePath = dir.resolve(fileName);

            facturaPdfTemplateRenderer.render(filePath, factura);

            return "/uploads/facturas/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("No se pudo generar el PDF de factura", ex);
        }
    }

    private String generarNumeroComprobante() {
        LocalDateTime now = LocalDateTime.now();
        String fecha = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String hora = now.format(java.time.format.DateTimeFormatter.ofPattern("HHmmss"));
        String random = String.format("%04d", (int) (Math.random() * 10000));
        return "FAC-" + fecha + "-" + hora + "-" + random;
    }
}
