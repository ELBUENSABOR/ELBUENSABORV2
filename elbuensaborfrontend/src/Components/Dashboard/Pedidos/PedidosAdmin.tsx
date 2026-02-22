import {useEffect, useState} from "react";
import type {PedidoResponse} from "../../../services/pedidoService";
import {cambiarEstadoPedido, emitirNotaCredito, getPedidoById, getPedidosAll, marcarPedidoPagado} from "../../../services/pedidoService";
import OrderDetailModal from "../../Common/OrderDetailModal/OrderDetailModal.tsx";
import ModalConfirmAction from "../../Common/ModalConfirmAction/ModalConfirmAction";
import { useSucursal } from "../../../contexts/SucursalContext";
import { useUser } from "../../../contexts/UsuarioContext";

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
    const { sucursales, sucursalId, setSucursalId } = useSucursal();
    const { user } = useUser();
    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
    const [estado, setEstado] = useState("");
    const [busquedaId, setBusquedaId] = useState("");
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<Record<number, string>>({});
    const [selectedPedido, setSelectedPedido] = useState<PedidoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showConfirmNotaCredito, setShowConfirmNotaCredito] = useState(false);
    const [pedidoAAnular, setPedidoAAnular] = useState<PedidoResponse | null>(null);

    const cargarPedidos = async (estadoFiltro?: string) => {
        setLoading(true);
        setError("");
        try {
            const data = await getPedidosAll(
                estadoFiltro || undefined,
                user?.role === "ADMIN" ? sucursalId : null
            );
            setPedidos(data);
            setSelectedPedido((prev) =>
                prev ? data.find((pedido) => pedido.id === prev.id) ?? null : null
            );
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
    }, [estado, busquedaId, sucursalId, user?.role]);

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
            setSelectedPedido(pedido);
        } catch (err) {
            setPedidos([]);
            setSelectedPedido(null);
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

    const puedeMarcarPagado = (pedido: PedidoResponse) =>
        pedido.tipoEnvio === "TAKE_AWAY" &&
        pedido.formaPago === "EFECTIVO" &&
        !pedido.pagado &&
        pedido.estado === "LISTO";

    const marcarPagado = async (pedido: PedidoResponse) => {
        setLoading(true);
        setError("");
        try {
            await marcarPedidoPagado(pedido.id);
            await cargarPedidos(estado);
        } catch (err) {
            setError("No se pudo marcar el pedido como pagado.");
        } finally {
            setLoading(false);
        }
    };

    const puedeEmitirNotaCredito = (pedido: PedidoResponse) =>
        !!pedido.factura &&
        !pedido.notaCredito &&
        pedido.estado !== "CANCELADO";

    const anularFactura = async (pedido: PedidoResponse) => {
        setLoading(true);
        setError("");
        try {
            await emitirNotaCredito(pedido.id);
            await cargarPedidos(estado);
        } catch (err) {
            setError("No se pudo emitir la nota de crédito.");
        } finally {
            setLoading(false);
        }
    };

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
                {user?.role === "ADMIN" && (
                    <div>
                        <label className="form-label">Sucursal</label>
                        <select
                            className="form-select"
                            value={sucursalId ?? ""}
                            onChange={(event) => {
                                const value = event.target.value;
                                setSucursalId(value ? Number(value) : null);
                            }}
                        >
                            <option value="">Todas</option>
                            {sucursales.map((sucursal) => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
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
                            <th>Pago</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th className="text-end">Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pedidos.length === 0 ? (
                            <tr>
                                <td colSpan={7}>No hay pedidos para mostrar.</td>
                            </tr>
                        ) : (
                            pedidos.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{formatDate(pedido.fechaPedido)}</td>
                                    <td>{pedido.numero}</td>
                                    <td>
                                        <span
                                            className={`badge ${pedido.pagado ? "bg-success" : "bg-warning text-dark"}`}
                                        >
                                            {pedido.pagado ? "Pagado" : "Pendiente"}
                                        </span>
                                    </td>
                                    <td>${pedido.total}</td>
                                    <td>{pedido.estado}</td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setSelectedPedido(pedido)}
                                            >
                                                Ver detalle
                                            </button>
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
                                            {puedeMarcarPagado(pedido) && (
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() => marcarPagado(pedido)}
                                                >
                                                    Marcar pagado
                                                </button>
                                            )}
                                            {puedeEmitirNotaCredito(pedido) && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => { setPedidoAAnular(pedido); setShowConfirmNotaCredito(true); }}
                                                >
                                                    Emitir nota de crédito
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}
            <ModalConfirmAction
                show={showConfirmNotaCredito}
                setShowModal={setShowConfirmNotaCredito}
                headerText="Confirmar emisión de nota de crédito"
                bodyText={pedidoAAnular
                    ? `¿Confirmás la anulación de la factura del pedido ${pedidoAAnular.numero}? Se devolverá el stock asociado.`
                    : "¿Confirmás la emisión de nota de crédito?"}
                onClick={() => {
                    if (pedidoAAnular) {
                        anularFactura(pedidoAAnular);
                        setPedidoAAnular(null);
                    }
                }}
            />
            <OrderDetailModal
                pedido={selectedPedido}
                onClose={() => setSelectedPedido(null)}
            />
        </div>
    );
};

export default PedidosAdmin;