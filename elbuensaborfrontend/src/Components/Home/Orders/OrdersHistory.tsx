import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUser} from "../../../contexts/UsuarioContext";
import type {PedidoResponse} from "../../../services/pedidoService";
import {getPedidosByCliente, resolveFacturaPdfUrl} from "../../../services/pedidoService";
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

const OrdersHistory = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<PedidoResponse[]>([]);
    const [selectedPedido, setSelectedPedido] = useState<PedidoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login", {
                state: { redirectTo: "/pedidos" },
                replace: true,
            });
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user?.userId) return;

        setLoading(true);
        setError("");

        getPedidosByCliente(Number(user.userId))
            .then(setOrders)
            .catch(() => setError("No se pudieron cargar los pedidos."))
            .finally(() => setLoading(false));
    }, [user?.userId]);

    const rows = useMemo(() => {
        return orders.map((pedido) => ({
            ...pedido,
            fechaFormateada: formatDate(pedido.fechaPedido),
        }));
    }, [orders]);

    if (!user) return null;
    if (loading) return <p className="p-4">Cargando pedidos...</p>;
    if (error) return <p className="text-danger p-4">{error}</p>;

    return (
        <div className="container py-4">
            <h3 className="mb-4">Mis pedidos</h3>

            {rows.length === 0 ? (
                <p>No hay pedidos registrados.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Número</th>
                            <th>Estado</th>
                            <th>Pago</th>
                            <th>Total</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((pedido) => (
                            <tr key={pedido.id}>
                                <td>{pedido.fechaFormateada}</td>
                                <td>{pedido.numero}</td>
                                <td>{pedido.estado}</td>
                                <td>
                                    <span
                                        className={`badge ${pedido.pagado ? "bg-success" : "bg-warning text-dark"}`}
                                    >
                                        {pedido.pagado ? "Pagado" : "Pendiente"}
                                    </span>
                                </td>
                                <td>${pedido.total}</td>
                                <td className="text-end">
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        type="button"
                                        onClick={() => setSelectedPedido(pedido)}
                                    >
                                        Ver detalle
                                    </button>
                                    {resolveFacturaPdfUrl(pedido.factura?.pdfUrl) ? (
                                        <a
                                            className="btn btn-sm btn-outline-success"
                                            href={resolveFacturaPdfUrl(pedido.factura?.pdfUrl)!}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Ver factura (PDF)
                                        </a>
                                    ) : (
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            type="button"
                                            disabled
                                            title="La factura aún no está disponible"
                                        >
                                            Ver factura (PDF)
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
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

export default OrdersHistory;