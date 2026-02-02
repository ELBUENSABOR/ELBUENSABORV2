import { useEffect, useState } from "react";
import { getPedidoById, getPedidosAll } from "../../../services/pedidoService";
import type { PedidoResponse } from "../../../services/pedidoService";

const ESTADOS = [
    { label: "A confirmar", value: "A_CONFIRMAR" },
    { label: "En cocina", value: "A_COCINA" },
    { label: "Listo", value: "LISTO" },
    { label: "En delivery", value: "EN_DELIVERY" },
    { label: "Entregado", value: "ENTREGADO" },
];

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

const PedidosAdmin = () => {
    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
    const [estado, setEstado] = useState("");
    const [busquedaId, setBusquedaId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const cargarPedidos = async (estadoFiltro?: string) => {
        setLoading(true);
        setError("");
        try {
            const data = await getPedidosAll(estadoFiltro || undefined);
            setPedidos(data);
        } catch (err) {
            setError("No se pudieron cargar los pedidos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!busquedaId.trim()) {
            cargarPedidos(estado);
        }
    }, [estado, busquedaId]);

    const handleBuscar = async () => {
        if (!busquedaId.trim()) {
            cargarPedidos(estado);
            return;
        }
        const id = Number(busquedaId);
        if (Number.isNaN(id)) {
            setError("Ingresá un ID válido.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const pedido = await getPedidoById(id);
            setPedidos([pedido]);
        } catch (err) {
            setPedidos([]);
            setError("No se encontró el pedido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex flex-wrap gap-3 align-items-end mb-4">
                <div>
                    <label className="form-label">Estado</label>
                    <select
                        className="form-select"
                        value={estado}
                        onChange={(event) => setEstado(event.target.value)}
                    >
                        <option value="">Todos</option>
                        {ESTADOS.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="form-label">Buscar por ID</label>
                    <input
                        className="form-control"
                        value={busquedaId}
                        onChange={(event) => setBusquedaId(event.target.value)}
                        placeholder="Ej: 123"
                    />
                </div>
                <button className="btn btn-primary" onClick={handleBuscar}>
                    Buscar
                </button>
            </div>

            {loading && <p>Cargando pedidos...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && (
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Número</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pedidos.length === 0 ? (
                            <tr>
                                <td colSpan={5}>No hay pedidos para mostrar.</td>
                            </tr>
                        ) : (
                            pedidos.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{formatDate(pedido.fechaPedido)}</td>
                                    <td>{pedido.numero}</td>
                                    <td>${pedido.total}</td>
                                    <td>{pedido.estado}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PedidosAdmin;