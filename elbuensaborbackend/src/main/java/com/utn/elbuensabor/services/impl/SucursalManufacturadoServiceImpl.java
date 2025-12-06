package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.dtos.RecetaItemResponse;
import com.utn.elbuensabor.dtos.SucursalManufacturadoFullResponse;
import com.utn.elbuensabor.dtos.SucursalManufacturadoRequest;
import com.utn.elbuensabor.dtos.SucursalManufacturadoResponse;
import com.utn.elbuensabor.entities.SucursalManufacturado;
import com.utn.elbuensabor.repositories.ArticuloManufacturadoRepository;
import com.utn.elbuensabor.repositories.SucursalEmpresaRepository;
import com.utn.elbuensabor.repositories.SucursalManufacturadoRepository;
import com.utn.elbuensabor.services.SucursalManufacturadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SucursalManufacturadoServiceImpl implements SucursalManufacturadoService {
    private final SucursalManufacturadoRepository repo;
    private final ArticuloManufacturadoRepository manufacturadoRepo;
    private final SucursalEmpresaRepository sucursalRepo;

    public List<SucursalManufacturadoResponse> getAllBySucursal(Long sucursalId) {
        return repo.findBySucursalId(sucursalId).stream()
                .map(this::toResponse)
                .toList();
    }

    public SucursalManufacturadoResponse create(Long sucursalId, SucursalManufacturadoRequest request) {
        var sucursal = sucursalRepo.findById(sucursalId)
                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));

        var manufacturado = manufacturadoRepo.findById(request.manufacturadoId())
                .orElseThrow(() -> new RuntimeException("Manufacturado no encontrado"));

        var entity = new SucursalManufacturado();
        entity.setSucursal(sucursal);
        entity.setManufacturado(manufacturado);
        entity.setPrecioVentaSucursal(request.precioVentaSucursal());
        entity.setActivo(request.activo());

        return toResponse(repo.save(entity));
    }

    public SucursalManufacturadoResponse update(Long sucursalId, Long manufacturadoId, SucursalManufacturadoRequest request) {
        var entity = repo.findBySucursalIdAndManufacturadoId(sucursalId, manufacturadoId)
                .orElseThrow(() -> new RuntimeException("Config de manufacturado no encontrada"));

        entity.setPrecioVentaSucursal(request.precioVentaSucursal());
        entity.setActivo(request.activo());

        return toResponse(repo.save(entity));
    }

    public SucursalManufacturadoFullResponse getOne(Long sucursalId, Long manufacturadoId) {

        // Sucursal-manufacturado config (precio sucursal + disponible o no)
        var config = repo.findBySucursalIdAndManufacturadoId(sucursalId, manufacturadoId)
                .orElseThrow(() -> new RuntimeException("Manufacturado no configurado para esta sucursal"));

        var m = config.getManufacturado();

        // Mapear receta
        var receta = m.getArticuloManufacturadoDetalles()
                .stream()
                .map(det -> new RecetaItemResponse(
                        det.getArticuloInsumo().getId(),
                        det.getArticuloInsumo().getDenominacion(),
                        det.getCantidad()
                ))
                .toList();

        return new SucursalManufacturadoFullResponse(
                m.getId(),
                m.getDenominacion(),
                m.getDescripcion(),
                m.getPrecioVenta(),              // precio base global
                config.getPrecioVentaSucursal(), // precio de la sucursal
                config.getActivo(),              // activo en esa sucursal
                receta
        );
    }

    public SucursalManufacturadoResponse toResponse(SucursalManufacturado entity) {
        return new SucursalManufacturadoResponse(
                entity.getManufacturado().getId(),
                entity.getManufacturado().getDenominacion(),
                entity.getManufacturado().getPrecioVenta(),
                entity.getPrecioVentaSucursal(),
                entity.getActivo()
        );
    }
}
