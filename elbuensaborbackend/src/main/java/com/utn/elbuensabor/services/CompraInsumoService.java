package com.utn.elbuensabor.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.dtos.RegistroCompraRequest;
import com.utn.elbuensabor.entities.ArticuloInsumo;
import com.utn.elbuensabor.entities.SucursalInsumo;
import com.utn.elbuensabor.repositories.ArticuloInsumoRepository;
import com.utn.elbuensabor.repositories.SucursalInsumoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompraInsumoService {

    private final SucursalInsumoRepository sucursalInsumoRepository;
    private final ArticuloInsumoRepository articuloInsumoRepository;

    @Transactional
    public void registrarCompra(Long insumoId, RegistroCompraRequest request) {
        SucursalInsumo stock = sucursalInsumoRepository
                .findBySucursalIdAndInsumoId(request.sucursalId(), insumoId)
                .orElseThrow(() -> new RuntimeException("Stock del insumo no registrado en la sucursal"));

        stock.setStockActual(stock.getStockActual() + request.cantidad());

        if (request.precioCompra() != null) {
            ArticuloInsumo insumo = stock.getInsumo();
            insumo.setPrecioCompra(request.precioCompra());
            articuloInsumoRepository.save(insumo);
        }

        sucursalInsumoRepository.save(stock);
    }
}

