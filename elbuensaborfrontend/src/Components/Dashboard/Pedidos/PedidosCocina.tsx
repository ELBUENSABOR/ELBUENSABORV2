import {useEffect, useMemo, useState} from "react";
import type {PedidoResponse} from "../../../services/pedidoService";
import {cambiarEstadoPedido, getPedidosAll} from "../../../services/pedidoService";
import {getManufacturadoById} from "../../../services/manufacturadosService";
import {useSucursal} from "../../../contexts/SucursalContext";
import OrderDetailModal from "../../Common/OrderDetailModal/OrderDetailModal.tsx";
import {useUser} from "../../../contexts/UsuarioContext";

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

const PedidosCocina = () => {
    const {sucursales, sucursalId, setSucursalId} = useSucursal();
    const {user} = useUser();
    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
    const [selectedPedido, setSelectedPedido] = useState<PedidoResponse | null>(null);
    const [recetas, setRecetas] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [detalleLoading, setDetalleLoading] = useState(false);
    const [error, setError] = useState("");

    const cargarPedidos = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getPedidosAll(
                "A_COCINA",
                user?.role === "ADMIN" ? sucursalId : null
            );
            const filtrados = data.filter((pedido: PedidoResponse) =>
                pedido.detalles.some((detalle) => detalle.articulo.tipo === "MANUFACTURADO")
            );
            setPedidos(filtrados);
        } catch (err) {
            setError("No se pudieron cargar los pedidos de cocina: " + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, [sucursalId, user?.role]);

    const pedidosRows = useMemo(
        () =>
            pedidos.map((pedido) => ({
                ...pedido,
                fechaFormateada: formatDate(pedido.fechaPedido),
            })),
        [pedidos]
    );

    const cargarRecetas = async (pedido: PedidoResponse) => {
        if (!sucursalId) return;
        const manufacturados = pedido.detalles
            .filter((detalle) => detalle.articulo.tipo === "MANUFACTURADO")
            .map((detalle) => detalle.articulo.id);

        const pendientes = manufacturados.filter((id) => recetas[id] === undefined);
        if (pendientes.length === 0) return;

        setDetalleLoading(true);
        try {
            const resultados = await Promise.all(
                pendientes.map(async (id) => {
                    const manufacturado = await getManufacturadoById(String(id), sucursalId);
                    return {id, receta: manufacturado.receta || "Sin receta"};
                })
            );
            setRecetas((prev) => {
                const next = {...prev};
                resultados.forEach((item) => {
                    next[item.id] = item.receta;
                });
                return next;
            });
        } catch (err) {
            setError("No se pudieron cargar las recetas: " + err);
        } finally {
            setDetalleLoading(false);
        }
    };

    const handleVerDetalle = async (pedido: PedidoResponse) => {
        setSelectedPedido(pedido);
        await cargarRecetas(pedido);
    };

    const marcarListo = async (pedidoId: number) => {
        setLoading(true);
        setError("");
        try {
            await cambiarEstadoPedido(pedidoId, "LISTO");
            if (selectedPedido?.id === pedidoId) {
                setSelectedPedido(null);
            }
            await cargarPedidos();
        } catch (err) {
            setError("No se pudo marcar el pedido como listo: " + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">
                {user?.role === "ADMIN" && (
                    <div>
                        <label className="mb-0 text-muted" htmlFor="sucursal-select">
                            Sucursal:
                        </label>
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
            </div>

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
                            <th>Total</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pedidosRows.length === 0 ? (
                            <tr>
                                <td colSpan={6}>No hay pedidos a preparar.</td>
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
                                    <td>${pedido.total}</td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleVerDetalle(pedido)}
                                            >
                                                Ver detalle
                                            </button>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => marcarListo(pedido.id)}
                                            >
                                                Marcar listo
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
            <OrderDetailModal
                pedido={selectedPedido}
                onClose={() => setSelectedPedido(null)}
            >
                {selectedPedido?.detalles.some(
                    (detalle) => detalle.articulo.tipo === "MANUFACTURADO"
                ) && (
                    <>
                        <hr/>
                        <h6>Recetas</h6>
                        {selectedPedido.detalles.map((detalle) => {
                            if (detalle.articulo.tipo !== "MANUFACTURADO") return null;
                            return (
                                <div key={detalle.id} className="mb-3">
                                    <div className="fw-semibold">
                                        {detalle.articulo.denominacion} x {detalle.cantidad}
                                    </div>
                                    <div className="mt-2">
                                        <p className="mb-1 text-muted">Receta:</p>
                                        <div className="border rounded p-2 bg-light">
                                            {detalleLoading
                                                ? "Cargando receta..."
                                                : recetas[detalle.articulo.id] || "Sin receta"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </OrderDetailModal>
        </div>
    );
};

export default PedidosCocina;