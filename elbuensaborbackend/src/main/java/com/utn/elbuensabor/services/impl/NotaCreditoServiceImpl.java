package com.utn.elbuensabor.services.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.entities.EstadoPedido;
import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.entities.FacturaVentaDetalle;
import com.utn.elbuensabor.entities.NotaCredito;
import com.utn.elbuensabor.entities.NotaCreditoDetalle;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.repositories.FacturaVentaRepository;
import com.utn.elbuensabor.repositories.NotaCreditoRepository;
import com.utn.elbuensabor.repositories.PedidoVentaRepository;
import com.utn.elbuensabor.services.NotaCreditoService;
import com.utn.elbuensabor.services.StockService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotaCreditoServiceImpl implements NotaCreditoService {

    private final FacturaVentaRepository facturaVentaRepository;
    private final NotaCreditoRepository notaCreditoRepository;
    private final PedidoVentaRepository pedidoVentaRepository;
    private final StockService stockService;

    @Override
    @Transactional
    public NotaCredito emitirDesdeFactura(Long facturaId) {
        FacturaVenta factura = facturaVentaRepository.findById(facturaId)
                .orElseThrow(() -> new IllegalArgumentException("Factura no encontrada"));

        if (notaCreditoRepository.findByFacturaId(facturaId).isPresent()) {
            throw new IllegalArgumentException("La factura ya fue anulada con una nota de crédito");
        }

        PedidoVenta pedido = factura.getPedido();
        if (pedido == null) {
            throw new IllegalArgumentException("La factura no está asociada a un pedido");
        }

        NotaCredito nota = new NotaCredito();
        nota.setFactura(factura);
        nota.setFechaEmision(LocalDateTime.now());
        nota.setNumeroComprobante(generarNumeroComprobante());
        nota.setMotivo("Anulación de factura " + factura.getNumeroComprobante());
        nota.setSubTotal(factura.getSubTotal());
        nota.setDescuento(factura.getDescuento());
        nota.setGastosEnvio(factura.getGastosEnvio());
        nota.setTotal(factura.getTotalVenta());

        for (FacturaVentaDetalle detalleFactura : factura.getDetalles()) {
            NotaCreditoDetalle detalle = new NotaCreditoDetalle();
            detalle.setNotaCredito(nota);
            detalle.setCantidad(detalleFactura.getCantidad());
            detalle.setSubTotal(detalleFactura.getSubTotal());
            detalle.setArticuloInsumo(detalleFactura.getArticuloInsumo());
            detalle.setArticuloManufacturado(detalleFactura.getArticuloManufacturado());
            nota.getDetalles().add(detalle);
        }

        NotaCredito saved = notaCreditoRepository.save(nota);

        if (Boolean.TRUE.equals(pedido.getStockDescontado())) {
            stockService.incrementarStock(pedido);
            pedido.setStockDescontado(false);
        }

        pedido.setEstado(EstadoPedido.CANCELADO);
        pedidoVentaRepository.save(pedido);

        return saved;
    }

    private String generarNumeroComprobante() {
        LocalDateTime now = LocalDateTime.now();
        String fecha = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String hora = now.format(java.time.format.DateTimeFormatter.ofPattern("HHmmss"));
        String random = String.format("%04d", (int) (Math.random() * 10000));
        return "NC-" + fecha + "-" + hora + "-" + random;
    }
}
