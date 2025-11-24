package com.utn.elbuensabor.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.utn.elbuensabor.dtos.PedidoDetalleDTO;
import com.utn.elbuensabor.dtos.PedidoRequest;
import com.utn.elbuensabor.dtos.PedidoResponse;
import com.utn.elbuensabor.entities.ArticuloInsumo;
import com.utn.elbuensabor.entities.ArticuloManufacturado;
import com.utn.elbuensabor.entities.Cliente;
import com.utn.elbuensabor.entities.EstadoPedido;
import com.utn.elbuensabor.entities.PedidoVenta;
import com.utn.elbuensabor.entities.PedidoVentaDetalle;
import com.utn.elbuensabor.entities.SucursalEmpresa;
import com.utn.elbuensabor.repositories.ArticuloInsumoRepository;
import com.utn.elbuensabor.repositories.ArticuloManufacturadoRepository;
import com.utn.elbuensabor.repositories.ClienteRepository;
import com.utn.elbuensabor.repositories.PedidoVentaRepository;
import com.utn.elbuensabor.repositories.SucursalEmpresaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoVentaRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final SucursalEmpresaRepository sucursalRepository;
    private final ArticuloInsumoRepository insumoRepository;
    private final ArticuloManufacturadoRepository manufacturadoRepository;
    private final StockService stockService;

    @Transactional
    public PedidoResponse create(PedidoRequest request) {
        // Validar cliente
        Cliente cliente = clienteRepository.findById(request.clienteId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));

        // Validar sucursal
        SucursalEmpresa sucursal = sucursalRepository.findById(request.sucursalId())
                .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada"));

        // Crear pedido
        PedidoVenta pedido = new PedidoVenta();
        pedido.setCliente(cliente);
        pedido.setSucursal(sucursal);
        pedido.setTipoEnvio(request.tipoEnvio());
        pedido.setFormaPago(request.formaPago());
        pedido.setEstado(EstadoPedido.A_CONFIRMAR);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setDescuento(request.descuento() != null ? request.descuento() : 0.0);
        pedido.setObservaciones(request.observaciones());
        pedido.setPagado(false);

        // Generar número de pedido único
        String numeroPedido = generarNumeroPedido();
        pedido.setNumero(numeroPedido);

        // Procesar detalles primero para poder verificar stock
        Double subTotal = 0.0;
        Double totalCosto = 0.0;

        for (PedidoDetalleDTO detalleDTO : request.detalles()) {
            if (!detalleDTO.isValid()) {
                throw new IllegalArgumentException("Cada detalle debe tener manufacturadoId o insumoId, pero no ambos");
            }

            PedidoVentaDetalle detalle = new PedidoVentaDetalle();
            detalle.setPedido(pedido);
            detalle.setCantidad(detalleDTO.cantidad());

            if (detalleDTO.manufacturadoId() != null) {
                ArticuloManufacturado manufacturado = manufacturadoRepository.findByIdAndActivoTrue(detalleDTO.manufacturadoId())
                        .orElseThrow(() -> new IllegalArgumentException("Artículo manufacturado no encontrado o inactivo: " + detalleDTO.manufacturadoId()));
                
                detalle.setManufacturado(manufacturado);
                detalle.setPrecioUnit(manufacturado.getPrecioVenta());
                detalle.setSubTotal(manufacturado.getPrecioVenta() * detalleDTO.cantidad());
                subTotal += detalle.getSubTotal();
                totalCosto += (manufacturado.getPrecioCosto() != null ? manufacturado.getPrecioCosto() : 0.0) * detalleDTO.cantidad();
            } else {
                ArticuloInsumo insumo = insumoRepository.findByIdAndActivoTrue(detalleDTO.insumoId())
                        .orElseThrow(() -> new IllegalArgumentException("Artículo insumo no encontrado o inactivo: " + detalleDTO.insumoId()));
                
                detalle.setInsumo(insumo);
                detalle.setPrecioUnit(insumo.getPrecioVenta());
                detalle.setSubTotal(insumo.getPrecioVenta() * detalleDTO.cantidad());
                subTotal += detalle.getSubTotal();
                totalCosto += (insumo.getPrecioCompra() != null ? insumo.getPrecioCompra() : 0.0) * detalleDTO.cantidad();
            }

            pedido.getDetalles().add(detalle);
        }

        // Verificar stock disponible antes de guardar el pedido
        List<String> erroresStock = stockService.verificarStockDisponible(pedido);
        if (!erroresStock.isEmpty()) {
            throw new IllegalArgumentException("Stock insuficiente: " + String.join("; ", erroresStock));
        }

        // Calcular totales
        pedido.setSubTotal(subTotal);
        Double descuento = pedido.getDescuento() != null ? pedido.getDescuento() : 0.0;
        Double gastosEnvio = request.tipoEnvio().name().equals("DELIVERY") ? calcularGastosEnvio() : 0.0;
        pedido.setGastosEnvio(gastosEnvio);
        pedido.setTotal(subTotal - descuento + gastosEnvio);
        pedido.setTotalCosto(totalCosto);

        // Calcular hora estimada de finalización
        pedido.setHoraEstimadaFinalizacion(calcularHoraEstimadaFinalizacion(pedido));

        // Guardar pedido (los detalles se guardan en cascada)
        pedido = pedidoRepository.save(pedido);

        return mapToResponse(pedido);
    }

    public PedidoResponse getById(Long id) {
        PedidoVenta pedido = pedidoRepository.findByIdWithDetalles(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        return mapToResponse(pedido);
    }

    public List<PedidoResponse> getAll() {
        return pedidoRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PedidoResponse> getByClienteId(Long clienteId) {
        return pedidoRepository.findByClienteIdWithDetalles(clienteId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PedidoResponse> getByEstado(EstadoPedido estado) {
        return pedidoRepository.findByEstadoWithDetalles(estado).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PedidoResponse> getBySucursalId(Long sucursalId) {
        return pedidoRepository.findBySucursalIdWithDetalles(sucursalId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PedidoResponse update(Long id, PedidoRequest request) {
        PedidoVenta pedido = pedidoRepository.findByIdWithDetalles(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Validar que el pedido se pueda modificar
        if (pedido.getEstado() == EstadoPedido.FACTURADO || 
            pedido.getEstado() == EstadoPedido.CANCELADO ||
            pedido.getEstado() == EstadoPedido.ENTREGADO) {
            throw new IllegalArgumentException("No se puede modificar un pedido en estado: " + pedido.getEstado());
        }

        // Actualizar datos básicos
        if (request.sucursalId() != null) {
            SucursalEmpresa sucursal = sucursalRepository.findById(request.sucursalId())
                    .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada"));
            pedido.setSucursal(sucursal);
        }

        pedido.setTipoEnvio(request.tipoEnvio());
        pedido.setFormaPago(request.formaPago());
        pedido.setDescuento(request.descuento() != null ? request.descuento() : 0.0);
        pedido.setObservaciones(request.observaciones());

        // Eliminar detalles existentes
        pedido.getDetalles().clear();

        // Agregar nuevos detalles
        Double subTotal = 0.0;
        Double totalCosto = 0.0;

        for (PedidoDetalleDTO detalleDTO : request.detalles()) {
            if (!detalleDTO.isValid()) {
                throw new IllegalArgumentException("Cada detalle debe tener manufacturadoId o insumoId, pero no ambos");
            }

            PedidoVentaDetalle detalle = new PedidoVentaDetalle();
            detalle.setPedido(pedido);
            detalle.setCantidad(detalleDTO.cantidad());

            if (detalleDTO.manufacturadoId() != null) {
                ArticuloManufacturado manufacturado = manufacturadoRepository.findByIdAndActivoTrue(detalleDTO.manufacturadoId())
                        .orElseThrow(() -> new IllegalArgumentException("Artículo manufacturado no encontrado o inactivo"));
                
                detalle.setManufacturado(manufacturado);
                detalle.setPrecioUnit(manufacturado.getPrecioVenta());
                detalle.setSubTotal(manufacturado.getPrecioVenta() * detalleDTO.cantidad());
                subTotal += detalle.getSubTotal();
                totalCosto += (manufacturado.getPrecioCosto() != null ? manufacturado.getPrecioCosto() : 0.0) * detalleDTO.cantidad();
            } else {
                ArticuloInsumo insumo = insumoRepository.findByIdAndActivoTrue(detalleDTO.insumoId())
                        .orElseThrow(() -> new IllegalArgumentException("Artículo insumo no encontrado o inactivo"));
                
                detalle.setInsumo(insumo);
                detalle.setPrecioUnit(insumo.getPrecioVenta());
                detalle.setSubTotal(insumo.getPrecioVenta() * detalleDTO.cantidad());
                subTotal += detalle.getSubTotal();
                totalCosto += (insumo.getPrecioCompra() != null ? insumo.getPrecioCompra() : 0.0) * detalleDTO.cantidad();
            }

            pedido.getDetalles().add(detalle);
        }

        // Recalcular totales
        pedido.setSubTotal(subTotal);
        Double descuento = pedido.getDescuento() != null ? pedido.getDescuento() : 0.0;
        Double gastosEnvio = request.tipoEnvio().name().equals("DELIVERY") ? calcularGastosEnvio() : 0.0;
        pedido.setGastosEnvio(gastosEnvio);
        pedido.setTotal(subTotal - descuento + gastosEnvio);
        pedido.setTotalCosto(totalCosto);

        pedido.setHoraEstimadaFinalizacion(calcularHoraEstimadaFinalizacion(pedido));

        pedido = pedidoRepository.save(pedido);

        return mapToResponse(pedido);
    }

    @Transactional
    public void delete(Long id) {
        PedidoVenta pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Validar que el pedido se pueda eliminar
        if (pedido.getEstado() == EstadoPedido.FACTURADO || 
            pedido.getEstado() == EstadoPedido.ENTREGADO) {
            throw new IllegalArgumentException("No se puede eliminar un pedido en estado: " + pedido.getEstado());
        }

        pedidoRepository.delete(pedido);
    }

    @Transactional
    public PedidoResponse cambiarEstado(Long id, EstadoPedido nuevoEstado) {
        PedidoVenta pedido = pedidoRepository.findByIdWithDetalles(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Validar transición de estado
        if (!esTransicionValida(pedido.getEstado(), nuevoEstado)) {
            throw new IllegalArgumentException("No se puede cambiar el estado de " + pedido.getEstado() + " a " + nuevoEstado);
        }

        // Si el pedido pasa a A_COCINA, decrementar el stock
        if (nuevoEstado == EstadoPedido.A_COCINA && pedido.getEstado() != EstadoPedido.A_COCINA) {
            try {
                stockService.decrementarStock(pedido);
            } catch (IllegalStateException ex) {
                throw new IllegalArgumentException("No se puede procesar el pedido: " + ex.getMessage());
            }
        }

        pedido.setEstado(nuevoEstado);
        pedido = pedidoRepository.save(pedido);

        return mapToResponse(pedido);
    }

    private String generarNumeroPedido() {
        // Formato: PED-YYYYMMDD-HHMMSS-XXXX
        LocalDateTime now = LocalDateTime.now();
        String fecha = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String hora = now.format(java.time.format.DateTimeFormatter.ofPattern("HHmmss"));
        String random = String.format("%04d", (int)(Math.random() * 10000));
        return "PED-" + fecha + "-" + hora + "-" + random;
    }

    private Double calcularGastosEnvio() {
        // Lógica para calcular gastos de envío (puede ser fijo o variable)
        return 500.0; // Ejemplo: $500 fijo
    }

    private LocalDateTime calcularHoraEstimadaFinalizacion(PedidoVenta pedido) {
        // Calcular basado en el tiempo estimado de los artículos manufacturados
        int tiempoTotal = pedido.getDetalles().stream()
                .filter(d -> d.getManufacturado() != null)
                .mapToInt(d -> (d.getManufacturado().getTiempoEstimado() != null ? d.getManufacturado().getTiempoEstimado() : 0) * d.getCantidad())
                .sum();
        
        // Mínimo 30 minutos
        tiempoTotal = Math.max(tiempoTotal, 30);
        
        return LocalDateTime.now().plusMinutes(tiempoTotal);
    }

    private boolean esTransicionValida(EstadoPedido estadoActual, EstadoPedido nuevoEstado) {
        // Definir transiciones válidas
        return switch (estadoActual) {
            case A_CONFIRMAR -> nuevoEstado == EstadoPedido.A_COCINA || nuevoEstado == EstadoPedido.CANCELADO || nuevoEstado == EstadoPedido.RECHAZADO;
            case A_COCINA -> nuevoEstado == EstadoPedido.LISTO || nuevoEstado == EstadoPedido.CANCELADO;
            case LISTO -> nuevoEstado == EstadoPedido.EN_DELIVERY || nuevoEstado == EstadoPedido.ENTREGADO;
            case EN_DELIVERY -> nuevoEstado == EstadoPedido.ENTREGADO;
            case ENTREGADO -> nuevoEstado == EstadoPedido.FACTURADO;
            default -> false;
        };
    }

    private PedidoResponse mapToResponse(PedidoVenta pedido) {
        return new PedidoResponse(
                pedido.getId(),
                pedido.getNumero(),
                pedido.getFechaPedido(),
                pedido.getHoraEstimadaFinalizacion(),
                pedido.getSubTotal(),
                pedido.getDescuento(),
                pedido.getGastosEnvio(),
                pedido.getTotal(),
                pedido.getTotalCosto(),
                pedido.getPagado(),
                pedido.getObservaciones(),
                pedido.getEstado(),
                pedido.getTipoEnvio(),
                pedido.getFormaPago(),
                new PedidoResponse.ClienteDTO(
                        pedido.getCliente().getId(),
                        pedido.getCliente().getNombre(),
                        pedido.getCliente().getApellido(),
                        pedido.getCliente().getEmail()
                ),
                pedido.getEmpleado() != null ? new PedidoResponse.EmpleadoDTO(
                        pedido.getEmpleado().getId(),
                        pedido.getEmpleado().getNombre(),
                        pedido.getEmpleado().getApellido()
                ) : null,
                new PedidoResponse.SucursalDTO(
                        pedido.getSucursal().getId(),
                        pedido.getSucursal().getNombre()
                ),
                pedido.getDetalles().stream()
                        .map(d -> new PedidoResponse.PedidoDetalleResponse(
                                d.getId(),
                                d.getManufacturado() != null 
                                        ? new PedidoResponse.PedidoDetalleResponse.ArticuloDTO(
                                                d.getManufacturado().getId(),
                                                d.getManufacturado().getDenominacion(),
                                                "MANUFACTURADO"
                                        )
                                        : new PedidoResponse.PedidoDetalleResponse.ArticuloDTO(
                                                d.getInsumo().getId(),
                                                d.getInsumo().getDenominacion(),
                                                "INSUMO"
                                        ),
                                d.getCantidad(),
                                d.getPrecioUnit(),
                                d.getSubTotal()
                        ))
                        .collect(Collectors.toList())
        );
    }
}

