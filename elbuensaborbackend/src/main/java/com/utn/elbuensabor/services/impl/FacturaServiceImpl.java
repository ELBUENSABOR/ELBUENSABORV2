package com.utn.elbuensabor.services.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.entities.FacturaVentaDetalle;
import com.utn.elbuensabor.entities.NotaCreditoVenta;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.entities.PedidoVentaDetalle;
import com.utn.elbuensabor.repositories.FacturaVentaRepository;
import com.utn.elbuensabor.services.FacturaService;

import lombok.RequiredArgsConstructor;

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

    public String generarPdfNotaCredito(NotaCreditoVenta notaCredito) {
        Path dir = Path.of("uploads", "notas-credito");
        try {
            Files.createDirectories(dir);
            String fileName = String.format("nota-credito-%d.pdf", notaCredito.getId());
            Path filePath = dir.resolve(fileName);

            FacturaVenta plantilla = construirPlantillaNotaCredito(notaCredito);
            facturaPdfTemplateRenderer.render(filePath, plantilla, "NOTA DE CRÉDITO");

            return "/uploads/notas-credito/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("No se pudo generar el PDF de la nota de crédito", ex);
        }
    }

    private FacturaVenta construirPlantillaNotaCredito(NotaCreditoVenta notaCredito) {
        FacturaVenta facturaPlantilla = new FacturaVenta();
        facturaPlantilla.setPedido(notaCredito.getPedido());
        facturaPlantilla.setFechaFacturacion(notaCredito.getFechaEmision());
        facturaPlantilla.setNumeroComprobante(notaCredito.getNumeroComprobante());
        facturaPlantilla.setFormaPago(notaCredito.getPedido().getFormaPago());

        FacturaVenta original = notaCredito.getFacturaOriginal();
        if (original != null) {
            facturaPlantilla.setSubTotal(original.getSubTotal());
            facturaPlantilla.setDescuento(original.getDescuento());
            facturaPlantilla.setGastosEnvio(original.getGastosEnvio());
            facturaPlantilla.setTotalVenta(original.getTotalVenta());
            facturaPlantilla.setPaymentId(original.getPaymentId());

            for (FacturaVentaDetalle detalleOriginal : original.getDetalles()) {
                FacturaVentaDetalle detalle = new FacturaVentaDetalle();
                detalle.setFactura(facturaPlantilla);
                detalle.setCantidad(detalleOriginal.getCantidad());
                detalle.setSubTotal(detalleOriginal.getSubTotal());
                detalle.setArticuloManufacturado(detalleOriginal.getArticuloManufacturado());
                detalle.setArticuloInsumo(detalleOriginal.getArticuloInsumo());
                facturaPlantilla.getDetalles().add(detalle);
            }
        } else {
            facturaPlantilla.setSubTotal(notaCredito.getTotal());
            facturaPlantilla.setDescuento(0.0);
            facturaPlantilla.setGastosEnvio(0.0);
            facturaPlantilla.setTotalVenta(notaCredito.getTotal());
        }

        return facturaPlantilla;
    }

    private String generarNumeroComprobante() {
        LocalDateTime now = LocalDateTime.now();
        String fecha = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String hora = now.format(java.time.format.DateTimeFormatter.ofPattern("HHmmss"));
        String random = String.format("%04d", (int) (Math.random() * 10000));
        return "FAC-" + fecha + "-" + hora + "-" + random;
    }
}
