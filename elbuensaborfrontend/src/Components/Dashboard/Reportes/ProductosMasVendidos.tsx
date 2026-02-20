import {useEffect, useMemo, useState} from "react";
import {
    fetchProductosMasVendidos,
    ReporteProductosVendidosDTO,
} from "../../../services/reportesService";

const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const buildCsv = (data: ReporteProductosVendidosDTO) => {
    const lines: string[] = [];
    lines.push("Productos de cocina");
    lines.push("Nombre,Cantidad");
    data.productosCocina.forEach((item) => {
        lines.push(`\"${item.nombre}\",${item.cantidad}`);
    });
    lines.push("");
    lines.push("Bebidas");
    lines.push("Nombre,Cantidad");
    data.bebidas.forEach((item) => {
        lines.push(`\"${item.nombre}\",${item.cantidad}`);
    });
    return lines.join("\n");
};

const ProductosMasVendidos = () => {
    const today = useMemo(() => formatDateInput(new Date()), []);
    const [desde, setDesde] = useState(today);
    const [hasta, setHasta] = useState(today);
    const [data, setData] = useState<ReporteProductosVendidosDTO>({
        productosCocina: [],
        bebidas: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        if (!desde || !hasta) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchProductosMasVendidos(desde, hasta);
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
        const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `productos-mas-vendidos-${desde}-${hasta}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="dashboard-table-card">
            <div className="dashboard-table-header d-flex flex-column flex-md-row align-items-md-center gap-3 justify-content-between">
                <div>
                    <h5 className="mb-1">Productos más vendidos</h5>
                    <small className="text-muted">
                        Consultá los productos más vendidos por rango de fechas.
                    </small>
                </div>
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleExport}
                    disabled={isLoading || (!data.productosCocina.length && !data.bebidas.length)}
                >
                    Exportar a Excel
                </button>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <label className="form-label">Desde</label>
                    <input
                        type="date"
                        className="form-control"
                        value={desde}
                        onChange={(event) => setDesde(event.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Hasta</label>
                    <input
                        type="date"
                        className="form-control"
                        value={hasta}
                        onChange={(event) => setHasta(event.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4 d-flex align-items-end">
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

            <div className="row g-4">
                <div className="col-12 col-lg-6">
                    <div className="table-responsive">
                        <table className="table table-hover dashboard-table">
                            <thead>
                            <tr>
                                <th>Productos de cocina</th>
                                <th className="text-end">Cantidad vendida</th>
                            </tr>
                            </thead>
                            <tbody className="table-group-divider">
                            {data.productosCocina.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="text-muted text-center">
                                        Sin ventas registradas en el período.
                                    </td>
                                </tr>
                            ) : (
                                data.productosCocina.map((item) => (
                                    <tr key={item.nombre}>
                                        <td>{item.nombre}</td>
                                        <td className="text-end">{item.cantidad}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="table-responsive">
                        <table className="table table-hover dashboard-table">
                            <thead>
                            <tr>
                                <th>Bebidas</th>
                                <th className="text-end">Cantidad vendida</th>
                            </tr>
                            </thead>
                            <tbody className="table-group-divider">
                            {data.bebidas.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="text-muted text-center">
                                        Sin ventas registradas en el período.
                                    </td>
                                </tr>
                            ) : (
                                data.bebidas.map((item) => (
                                    <tr key={item.nombre}>
                                        <td>{item.nombre}</td>
                                        <td className="text-end">{item.cantidad}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductosMasVendidos;