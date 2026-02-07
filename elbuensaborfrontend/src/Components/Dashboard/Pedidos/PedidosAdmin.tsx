import { useEffect, useState } from "react";
import { cambiarEstadoPedido, getPedidoById, getPedidosAll } from "../../../services/pedidoService";
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
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<Record<number, string>>({});
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
    const obtenerOpciones = (pedido: PedidoResponse) => {
        const requiereCocina = pedido.detalles.some(
            (detalle) => detalle.articulo.tipo === "MANUFACTURADO"
        );

        switch (pedido.estado) {
            case "A_CONFIRMAR":
                return requiereCocina ? ["A_COCINA"] : ["LISTO"];
            case "A_COCINA":
                return ["LISTO"];
            case "LISTO":
                return pedido.tipoEnvio === "DELIVERY" ? ["EN_DELIVERY"] : ["ENTREGADO"];
            case "EN_DELIVERY":
                return ["ENTREGADO"];
            default:
                return [];
        }
    };

    const puedeEntregar = (pedido: PedidoResponse) => pedido.pagado;

    const actualizarEstado = async (pedido: PedidoResponse) => {
        const nuevoEstado = estadoSeleccionado[pedido.id];
        if (!nuevoEstado) return;
        setLoading(true);
        setError("");
        try {
            await cambiarEstadoPedido(pedido.id, nuevoEstado);
            setEstadoSeleccionado((prev) => {
                const next = { ...prev };
                delete next[pedido.id];
                return next;
            });
            await cargarPedidos(estado);
        } catch (err) {
            setError("No se pudo actualizar el estado del pedido.");
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
                            <th className="text-end">Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pedidos.length === 0 ? (
                            <tr>
                                <td colSpan={6}>No hay pedidos para mostrar.</td>
                            </tr>
                        ) : (
                            pedidos.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{formatDate(pedido.fechaPedido)}</td>
                                    <td>{pedido.numero}</td>
                                    <td>${pedido.total}</td>
                                    <td>{pedido.estado}</td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                                            <select
                                                className="form-select form-select-sm"
                                                style={{ width: "180px" }}
                                                value={estadoSeleccionado[pedido.id] || ""}
                                                onChange={(event) =>
                                                    setEstadoSeleccionado((prev) => ({
                                                        ...prev,
                                                        [pedido.id]: event.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">Seleccionar</option>
                                                {obtenerOpciones(pedido).map((opcion) => {
                                                    const disabled =
                                                        opcion === "ENTREGADO" && !puedeEntregar(pedido);
                                                    return (
                                                        <option key={opcion} value={opcion} disabled={disabled}>
                                                            {opcion.replace(/_/g, " ")}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                disabled={!estadoSeleccionado[pedido.id]}
                                                onClick={() => actualizarEstado(pedido)}
                                            >
                                                Actualizar
                                            </button>
                                        </div>
                                    </td>
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