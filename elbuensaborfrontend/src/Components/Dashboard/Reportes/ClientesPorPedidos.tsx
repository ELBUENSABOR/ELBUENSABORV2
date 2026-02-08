import { useEffect, useMemo, useState } from "react";
import {
    fetchClientesPorPedidos,
    ReporteClientesPedidosDTO,
} from "../../../services/reportesService";
import { getPedidosByCliente } from "../../../services/pedidoService";
import type { PedidoResponse } from "../../../services/pedidoService";
import OrderDetailModal from "../../Common/OrderDetailModal/OrderDetailModal";

const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatDateTime = (value: string) => {
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

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);

const buildCsv = (data: ReporteClientesPedidosDTO[]) => {
    const lines: string[] = ["Cliente,Email,Cantidad de pedidos,Importe total"];
    data.forEach((item) => {
        const nombre = `${item.nombre} ${item.apellido}`;
        lines.push(`\"${nombre}\",\"${item.email}\",${item.cantidadPedidos},${item.totalPedidos}`);
    });
    return lines.join("\n");
};

const ClientesPorPedidos = () => {
    const today = useMemo(() => formatDateInput(new Date()), []);
    const [desde, setDesde] = useState(today);
    const [hasta, setHasta] = useState(today);
    const [orden, setOrden] = useState<"PEDIDOS" | "TOTAL">("PEDIDOS");
    const [data, setData] = useState<ReporteClientesPedidosDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedCliente, setSelectedCliente] = useState<ReporteClientesPedidosDTO | null>(null);
    const [clientePedidos, setClientePedidos] = useState<PedidoResponse[]>([]);
    const [pedidosLoading, setPedidosLoading] = useState(false);
    const [pedidosError, setPedidosError] = useState<string | null>(null);
    const [selectedPedido, setSelectedPedido] = useState<PedidoResponse | null>(null);

    const loadData = async () => {
        if (!desde || !hasta) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchClientesPorPedidos(desde, hasta, orden);
            setData(response);
        } catch (err: any) {
            setError(err.response?.data?.message ?? "No se pudo cargar el reporte.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleExport = () => {
        const csv = buildCsv(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `clientes-por-pedidos-${desde}-${hasta}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const isPedidoDentroDeRango = (fecha: string) => {
        const pedidoDate = new Date(fecha);
        if (Number.isNaN(pedidoDate.getTime())) return true;
        const inicio = new Date(`${desde}T00:00:00`);
        const fin = new Date(`${hasta}T23:59:59`);
        return pedidoDate >= inicio && pedidoDate <= fin;
    };

    const handleVerPedidos = async (cliente: ReporteClientesPedidosDTO) => {
        setSelectedCliente(cliente);
        setPedidosLoading(true);
        setPedidosError(null);
        setClientePedidos([]);
        try {
            const pedidos = await getPedidosByCliente(cliente.clienteId);
            const filtrados = pedidos.filter((pedido: PedidoResponse) =>
                isPedidoDentroDeRango(pedido.fechaPedido)
            );
            setClientePedidos(filtrados);
        } catch (err: any) {
            setPedidosError(err.response?.data?.message ?? "No se pudieron cargar los pedidos.");
        } finally {
            setPedidosLoading(false);
        }
    };

    const closePedidosModal = () => {
        setSelectedCliente(null);
        setClientePedidos([]);
        setPedidosError(null);
        setSelectedPedido(null);
    };

    return (
        <div className="dashboard-table-card">
            <div className="dashboard-table-header d-flex flex-column flex-md-row align-items-md-center gap-3 justify-content-between">
                <div>
                    <h5 className="mb-1">Clientes por pedidos</h5>
                    <small className="text-muted">
                        Consultá los clientes con más pedidos o mayor facturación por período.
                    </small>
                </div>
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleExport}
                    disabled={isLoading || data.length === 0}
                >
                    Exportar a Excel
                </button>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-3">
                    <label className="form-label">Desde</label>
                    <input
                        type="date"
                        className="form-control"
                        value={desde}
                        onChange={(event) => setDesde(event.target.value)}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <label className="form-label">Hasta</label>
                    <input
                        type="date"
                        className="form-control"
                        value={hasta}
                        onChange={(event) => setHasta(event.target.value)}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <label className="form-label">Ordenar por</label>
                    <select
                        className="form-select"
                        value={orden}
                        onChange={(event) => setOrden(event.target.value as "PEDIDOS" | "TOTAL")}
                    >
                        <option value="PEDIDOS">Cantidad de pedidos</option>
                        <option value="TOTAL">Importe total</option>
                    </select>
                </div>
                <div className="col-12 col-md-3 d-flex align-items-end">
                    <button
                        type="button"
                        className="btn btn-danger w-100"
                        onClick={loadData}
                        disabled={isLoading || !desde || !hasta}
                    >
                        {isLoading ? "Cargando..." : "Consultar"}
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="table-responsive">
                <table className="table table-hover dashboard-table">
                    <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th className="text-end">Pedidos</th>
                        <th className="text-end">Importe total</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="table-group-divider">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-muted text-center">
                                Sin pedidos registrados en el período.
                            </td>
                        </tr>
                    ) : (
                        data.map((cliente) => (
                            <tr key={cliente.clienteId}>
                                <td>{cliente.nombre} {cliente.apellido}</td>
                                <td>{cliente.email}</td>
                                <td className="text-end">{cliente.cantidadPedidos}</td>
                                <td className="text-end">{formatCurrency(cliente.totalPedidos)}</td>
                                <td className="text-end">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => handleVerPedidos(cliente)}
                                    >
                                        Ver pedidos
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {selectedCliente && (
                <>
                    <div className="modal fade show" style={{ display: "block" }} role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-xl modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Pedidos de {selectedCliente.nombre} {selectedCliente.apellido}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={closePedidosModal}
                                        aria-label="Cerrar"
                                    />
                                </div>
                                <div className="modal-body">
                                    <p className="text-muted">
                                        Pedidos entre {desde} y {hasta}.
                                    </p>
                                    {pedidosLoading && <p>Cargando pedidos...</p>}
                                    {pedidosError && <p className="text-danger">{pedidosError}</p>}
                                    {!pedidosLoading && !pedidosError && (
                                        <div className="table-responsive">
                                            <table className="table table-striped align-middle">
                                                <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Fecha</th>
                                                    <th>Total</th>
                                                    <th>Estado</th>
                                                    <th>Pago</th>
                                                    <th className="text-end">Acciones</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {clientePedidos.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="text-center text-muted">
                                                            No hay pedidos en este período.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    clientePedidos.map((pedido) => (
                                                        <tr key={pedido.id}>
                                                            <td>{pedido.id}</td>
                                                            <td>{formatDateTime(pedido.fechaPedido)}</td>
                                                            <td>{formatCurrency(pedido.total)}</td>
                                                            <td>{pedido.estado}</td>
                                                            <td>
                                                                    <span
                                                                        className={`badge ${pedido.pagado ? "bg-success" : "bg-warning text-dark"}`}
                                                                    >
                                                                        {pedido.pagado ? "Pagado" : "Pendiente"}
                                                                    </span>
                                                            </td>
                                                            <td className="text-end">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-secondary"
                                                                    onClick={() => setSelectedPedido(pedido)}
                                                                >
                                                                    Ver detalle
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closePedidosModal}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" onClick={closePedidosModal} />
                </>
            )}

            <OrderDetailModal
                pedido={selectedPedido}
                onClose={() => setSelectedPedido(null)}
            />
        </div>
    );
};

export default ClientesPorPedidos;