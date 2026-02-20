import type {ReactNode} from "react";
import type {PedidoResponse} from "../../../services/pedidoService";
import {resolveFacturaPdfUrl} from "../../../services/pedidoService";

type OrderDetailModalProps = {
    pedido: PedidoResponse | null;
    onClose: () => void;
    children?: ReactNode;
};

const OrderDetailModal = ({pedido, onClose, children}: OrderDetailModalProps) => {
    if (!pedido) return null;

    const fechaFormateada = new Date(pedido.fechaPedido).toLocaleString("es-AR");

    return (
        <>
            <div className="modal fade show" style={{display: "block"}} role="dialog" aria-modal="true">
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Detalle del pedido {pedido.numero}</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"/>
                        </div>
                        <div className="modal-body">
                            <p>
                                <strong>Fecha:</strong> {fechaFormateada}
                            </p>
                            <p>
                                <strong>Número de pedido:</strong> {pedido.numero}
                            </p>
                            <p>
                                <strong>Cliente:</strong> {pedido.cliente.nombre} {pedido.cliente.apellido}
                            </p>
                            <p>
                                <strong>Forma de entrega:</strong>{" "}
                                {pedido.tipoEnvio === "DELIVERY" ? "Envío a domicilio" : "Retiro en local"}
                            </p>
                            <p>
                                <strong>Forma de pago:</strong>{" "}
                                {pedido.formaPago === "MP" ? "Mercado Pago" : "Efectivo"}
                            </p>
                            {pedido.telefonoEntrega && (
                                <p>
                                    <strong>Teléfono:</strong> {pedido.telefonoEntrega}
                                </p>
                            )}
                            {pedido.direccionEntrega && (
                                <p>
                                    <strong>Dirección:</strong> {pedido.direccionEntrega}
                                </p>
                            )}
                            <p>
                                <strong>Estado:</strong> {pedido.estado}
                            </p>
                            <p>
                                <strong>Pago:</strong> {pedido.pagado ? "Pagado" : "Pendiente"}
                            </p>
                            {pedido.total != null && (
                                <p>
                                    <strong>Total:</strong> ${pedido.total}
                                </p>
                            )}
                            <hr/>
                            <h6>Ítems del pedido</h6>
                            {pedido.detalles.map((detalle) => (
                                <div
                                    key={detalle.id}
                                    className="d-flex justify-content-between border-bottom py-2"
                                >
                                    <span>
                                        {detalle.articulo.denominacion} x {detalle.cantidad}
                                    </span>
                                    <span>${detalle.subTotal}</span>
                                </div>
                            ))}
                            <div className="mt-3 text-end">
                                <p className="mb-1">Subtotal: ${pedido.subTotal}</p>
                                {pedido.descuento > 0 && (
                                    <p className="mb-1">Descuento: -${pedido.descuento}</p>
                                )}
                                {pedido.gastosEnvio > 0 && (
                                    <p className="mb-1">Envío: ${pedido.gastosEnvio}</p>
                                )}
                                <h6 className="mb-0">Total: ${pedido.total}</h6>
                            </div>
                            {resolveFacturaPdfUrl(pedido.factura?.pdfUrl) && (
                                <div className="mt-3">
                                    <a
                                        href={resolveFacturaPdfUrl(pedido.factura?.pdfUrl)!}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline-success"
                                    >
                                        Ver factura (PDF)
                                    </a>
                                </div>
                            )}
                            {children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={onClose}/>
        </>
    );
};

export default OrderDetailModal;