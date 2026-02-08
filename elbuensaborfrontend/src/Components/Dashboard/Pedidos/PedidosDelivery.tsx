import { useEffect, useMemo, useState } from "react";
import type { PedidoResponse } from "../../../services/pedidoService";
import { cambiarEstadoPedido, getPedidosAll } from "../../../services/pedidoService";
import OrderDetailModal from "../../Common/OrderDetailModal/OrderDetailModal.tsx";

const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const PedidosDelivery = () => {
    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
    const [selectedPedido, setSelectedPedido] = useState<PedidoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const cargarPedidos = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getPedidosAll("EN_DELIVERY");
            setPedidos(data);
        } catch (err) {
            setError("No se pudieron cargar los pedidos en delivery.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    const pedidosRows = useMemo(
        () =>
            pedidos.map((pedido) => ({
                ...pedido,
                fechaFormateada: formatDate(pedido.fechaPedido),
            })),
        [pedidos]
    );

    const marcarEntregado = async (pedidoId: number) => {
        setLoading(true);
        setError("");
        try {
            await cambiarEstadoPedido(pedidoId, "ENTREGADO");
            if (selectedPedido?.id === pedidoId) {
                setSelectedPedido(null);
            }
            await cargarPedidos();
        } catch (err) {
            setError("No se pudo marcar el pedido como entregado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="mb-3">Pedidos en delivery</h3>

            {loading && <p>Cargando pedidos...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && (
                <div className="table-responsive mb-4">
                    <table className="table table-striped align-middle">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Número</th>
                            <th>Cliente</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pedidosRows.length === 0 ? (
                            <tr>
                                <td colSpan={7}>No hay pedidos en delivery.</td>
                            </tr>
                        ) : (
                            pedidosRows.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{pedido.fechaFormateada}</td>
                                    <td>{pedido.numero}</td>
                                    <td>
                                        {pedido.cliente.nombre} {pedido.cliente.apellido}
                                    </td>
                                    <td>{pedido.direccionEntrega || "-"}</td>
                                    <td>{pedido.telefonoEntrega || "-"}</td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setSelectedPedido(pedido)}
                                            >
                                                Ver detalle
                                            </button>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => marcarEntregado(pedido.id)}
                                                disabled={!pedido.pagado}
                                            >
                                                Marcar entregado
                                            </button>
                                        </div>
                                        {!pedido.pagado && (
                                            <small className="text-muted d-block mt-1">
                                                Pendiente de pago
                                            </small>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}
            <OrderDetailModal
                pedido={selectedPedido}
                onClose={() => setSelectedPedido(null)}
            />
        </div>
    );
};

export default PedidosDelivery;