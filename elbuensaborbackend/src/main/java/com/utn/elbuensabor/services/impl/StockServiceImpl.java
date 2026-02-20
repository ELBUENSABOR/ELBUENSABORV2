package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.dtos.StockAlertaDTO;
import com.utn.elbuensabor.entities.*;
import com.utn.elbuensabor.repositories.ArticuloManufacturadoDetalleRepository;
import com.utn.elbuensabor.repositories.SucursalInsumoRepository;
import com.utn.elbuensabor.services.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

    private final SucursalInsumoRepository sucursalInsumoRepository;
    private final ArticuloManufacturadoDetalleRepository manufacturadoDetalleRepository;

    /**
     * Verifica si hay stock suficiente para un pedido antes de crearlo
     *
     * @param pedido El pedido a verificar
     * @return Lista de mensajes de error si hay problemas de stock, lista vacía si todo está bien
     */
    public List<String> verificarStockDisponible(PedidoVenta pedido) {
        List<String> errores = new ArrayList<>();
        Long sucursalId = pedido.getSucursal().getId();

        // Agrupar requerimientos de insumos por insumo
        Map<Long, Double> requerimientosInsumos = new HashMap<>();

        for (PedidoVentaDetalle detalle : pedido.getDetalles()) {
            if (detalle.getManufacturado() != null) {
                // Es un artículo manufacturado, necesitamos calcular los insumos de su receta
                ArticuloManufacturado manufacturado = detalle.getManufacturado();
                List<ArticuloManufacturadoDetalle> receta = manufacturadoDetalleRepository
                        .findByArticuloManufacturadoId(manufacturado.getId());

                for (ArticuloManufacturadoDetalle detalleReceta : receta) {
                    Long insumoId = detalleReceta.getArticuloInsumo().getId();
                    Double cantidadNecesaria = detalleReceta.getCantidad() * detalle.getCantidad();
                    requerimientosInsumos.merge(insumoId, cantidadNecesaria, Double::sum);
                }
            } else if (detalle.getInsumo() != null) {
                // Es un insumo directo (bebida, etc.)
                Long insumoId = detalle.getInsumo().getId();
                Double cantidadNecesaria = detalle.getCantidad().doubleValue();
                requerimientosInsumos.merge(insumoId, cantidadNecesaria, Double::sum);
            }
        }

        // Verificar stock disponible para cada insumo requerido
        for (Map.Entry<Long, Double> entry : requerimientosInsumos.entrySet()) {
            Long insumoId = entry.getKey();
            Double cantidadRequerida = entry.getValue();

            SucursalInsumo stock = sucursalInsumoRepository
                    .findBySucursalIdAndInsumoId(sucursalId, insumoId)
                    .orElse(null);

            if (stock == null) {
                errores.add("No existe registro de stock para el insumo ID: " + insumoId);
                continue;
            }

            if (stock.getStockActual() < cantidadRequerida) {
                ArticuloInsumo insumo = stock.getInsumo();
                errores.add(String.format(
                        "Stock insuficiente para '%s'. Disponible: %.2f, Requerido: %.2f",
                        insumo.getDenominacion(),
                        stock.getStockActual(),
                        cantidadRequerida
                ));
            }
        }

        return errores;
    }

    /**
     * Decrementa el stock cuando un pedido pasa a cocina
     *
     * @param pedido El pedido que se está procesando
     * @throws IllegalStateException Si no hay stock suficiente
     */
    @Transactional
    public void decrementarStock(PedidoVenta pedido) {
        Long sucursalId = pedido.getSucursal().getId();

        // Agrupar requerimientos de insumos por insumo
        Map<Long, Double> requerimientosInsumos = new HashMap<>();

        for (PedidoVentaDetalle detalle : pedido.getDetalles()) {
            if (detalle.getManufacturado() != null) {
                // Es un artículo manufacturado
                ArticuloManufacturado manufacturado = detalle.getManufacturado();
                List<ArticuloManufacturadoDetalle> receta = manufacturadoDetalleRepository
                        .findByArticuloManufacturadoId(manufacturado.getId());

                for (ArticuloManufacturadoDetalle detalleReceta : receta) {
                    Long insumoId = detalleReceta.getArticuloInsumo().getId();
                    Double cantidadNecesaria = detalleReceta.getCantidad() * detalle.getCantidad();
                    requerimientosInsumos.merge(insumoId, cantidadNecesaria, Double::sum);
                }
            } else if (detalle.getInsumo() != null) {
                // Es un insumo directo
                Long insumoId = detalle.getInsumo().getId();
                Double cantidadNecesaria = detalle.getCantidad().doubleValue();
                requerimientosInsumos.merge(insumoId, cantidadNecesaria, Double::sum);
            }
        }

        // Decrementar stock para cada insumo
        for (Map.Entry<Long, Double> entry : requerimientosInsumos.entrySet()) {
            Long insumoId = entry.getKey();
            Double cantidadRequerida = entry.getValue();

            SucursalInsumo stock = sucursalInsumoRepository
                    .findBySucursalIdAndInsumoId(sucursalId, insumoId)
                    .orElseThrow(() -> new IllegalStateException(
                            "No existe registro de stock para el insumo ID: " + insumoId));

            Double stockActual = stock.getStockActual();
            if (stockActual < cantidadRequerida) {
                throw new IllegalStateException(String.format(
                        "Stock insuficiente para el insumo ID %d. Disponible: %.2f, Requerido: %.2f",
                        insumoId, stockActual, cantidadRequerida));
            }

            // Decrementar stock (nunca puede ser negativo por la validación anterior)
            Double nuevoStock = stockActual - cantidadRequerida;
            if (nuevoStock < 0) {
                throw new IllegalStateException(
                        "Error crítico: El stock no puede ser negativo. Esto indica un problema en el sistema.");
            }

            stock.setStockActual(nuevoStock);
            sucursalInsumoRepository.save(stock);
        }
    }

    /**
     * Verifica si un artículo manufacturado tiene stock suficiente
     *
     * @param manufacturadoId ID del artículo manufacturado
     * @param cantidad        Cantidad requerida
     * @param sucursalId      ID de la sucursal
     * @return true si hay stock suficiente, false en caso contrario
     */
    public boolean verificarStockArticuloManufacturado(Long manufacturadoId, Integer cantidad, Long sucursalId) {
        List<ArticuloManufacturadoDetalle> receta = manufacturadoDetalleRepository
                .findByArticuloManufacturadoId(manufacturadoId);

        for (ArticuloManufacturadoDetalle detalleReceta : receta) {
            Long insumoId = detalleReceta.getArticuloInsumo().getId();
            Double cantidadNecesaria = detalleReceta.getCantidad() * cantidad;

            SucursalInsumo stock = sucursalInsumoRepository
                    .findBySucursalIdAndInsumoId(sucursalId, insumoId)
                    .orElse(null);

            if (stock == null || stock.getStockActual() < cantidadNecesaria) {
                return false;
            }
        }

        return true;
    }

    /**
     * Verifica si un insumo tiene stock suficiente
     *
     * @param insumoId   ID del insumo
     * @param cantidad   Cantidad requerida
     * @param sucursalId ID de la sucursal
     * @return true si hay stock suficiente, false en caso contrario
     */
    public boolean verificarStockInsumo(Long insumoId, Integer cantidad, Long sucursalId) {
        SucursalInsumo stock = sucursalInsumoRepository
                .findBySucursalIdAndInsumoId(sucursalId, insumoId)
                .orElse(null);

        return stock != null && stock.getStockActual() >= cantidad;
    }

    /**
     * Obtiene el stock actual de un insumo en una sucursal
     *
     * @param insumoId   ID del insumo
     * @param sucursalId ID de la sucursal
     * @return Stock actual o 0.0 si no existe registro
     */
    public Double obtenerStockActual(Long insumoId, Long sucursalId) {
        return sucursalInsumoRepository
                .findBySucursalIdAndInsumoId(sucursalId, insumoId)
                .map(SucursalInsumo::getStockActual)
                .orElse(0.0);
    }

    public List<StockAlertaDTO> obtenerAlertas(Long sucursalId) {
        List<SucursalInsumo> bajo = sucursalInsumoRepository.findStockBajoMinimo(sucursalId);
        List<SucursalInsumo> cerca = sucursalInsumoRepository.findStockCercaMinimo(sucursalId);

        return Stream.concat(
                        bajo.stream().map(si -> toAlerta(si, "BAJO")),
                        cerca.stream().map(si -> toAlerta(si, "PRECAUCION")))
                .toList();
    }

    public StockAlertaDTO toAlerta(SucursalInsumo sucursalInsumo, String nivel) {
        ArticuloInsumo insumo = sucursalInsumo.getInsumo();
        return new StockAlertaDTO(
                insumo.getId(),
                insumo.getDenominacion(),
                sucursalInsumo.getStockActual(),
                sucursalInsumo.getStockMinimo(),
                nivel);
    }
}

