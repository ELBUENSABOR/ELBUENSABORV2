package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.services.CompraInsumoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.dtos.*;
import com.utn.elbuensabor.entities.*;
import com.utn.elbuensabor.repositories.CompraInsumoRepository;
import com.utn.elbuensabor.repositories.ArticuloInsumoRepository;
import com.utn.elbuensabor.repositories.SucursalInsumoRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompraInsumoServiceImpl implements CompraInsumoService {

    private final SucursalInsumoRepository sucursalInsumoRepository;
    private final ArticuloInsumoRepository articuloInsumoRepository;
    private final CompraInsumoRepository compraInsumoRepository;

    @Transactional
    public List<RegistroCompraDTO> getAllRegistros() {
        return compraInsumoRepository.findAll().stream().map((c) -> new RegistroCompraDTO(
                c.getId(),
                mapToSucursalDTO(c.getSucursal()),
                mapToInsumoResponse(c.getInsumo()),
                c.getCantidad(),
                c.getFechaCompra(),
                c.getPrecioCompra(),
                c.getTotalCompra())).toList();
    }

    @Transactional
    public void registrarCompra(RegistroCompraRequest request) {
        SucursalInsumo stock = sucursalInsumoRepository
                .findBySucursalIdAndInsumoId(request.sucursalId(), request.insumoId())
                .orElseThrow(() -> new RuntimeException("Stock del insumo no registrado en la sucursal"));

        stock.setStockActual(roundStock(stock.getStockActual() + request.cantidad()));

        if (request.precioCompra() != null) {
            ArticuloInsumo insumo = stock.getInsumo();
            insumo.setPrecioCompra(request.precioCompra());
            articuloInsumoRepository.save(insumo);
        }

        sucursalInsumoRepository.save(stock);

        CompraInsumo compra = new CompraInsumo();
        compra.setSucursal(stock.getSucursal());
        compra.setInsumo(stock.getInsumo());
        compra.setCantidad(request.cantidad());
        compra.setPrecioCompra(
                request.precioCompra() != null ? request.precioCompra() : stock.getInsumo().getPrecioCompra());
        compra.setFechaCompra(LocalDateTime.now());
        compra.setTotalCompra(compra.getPrecioCompra() * request.cantidad());

        compraInsumoRepository.save(compra);
    }

    private Double roundStock(Double value) {
        if (value == null) {
            return 0.0;
        }
        return BigDecimal.valueOf(value)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private SucursalDTO mapToSucursalDTO(SucursalEmpresa s) {
        return new SucursalDTO(
                s.getId(),
                s.getNombre(),
                s.getHorarioApertura(),
                s.getHorarioCierre());
    }

    private ArticuloInsumoResponse mapToInsumoResponse(ArticuloInsumo i) {
        UnidadMedidaDTO unidadMedidaDTO = null;
        if (i.getUnidadMedida() != null) {
            unidadMedidaDTO = new UnidadMedidaDTO(i.getUnidadMedida().getId(), i.getUnidadMedida().getDenominacion(), i.getUnidadMedida().isActivo());
        }
        return new ArticuloInsumoResponse(
                i.getId(),
                i.getDenominacion(),
                null,
                i.getPrecioVenta(),
                i.getPrecioCompra(),
                null,
                mapToCategoriaResponse(i.getCategoriaArticuloInsumo()),
                i.getEsParaElaborar(),
                i.getActivo(),
                unidadMedidaDTO,
                java.util.List.of(),
                null
        );
    }

    private CategoriaResponse mapToCategoriaResponse(CategoriaArticuloInsumo c) {
        return new CategoriaResponse(
                c.getId(),
                c.getDenominacion(),
                c.getCategoriaPadre() != null ? c.getCategoriaPadre().getId() : null,
                c.isActivo());
    }
}
