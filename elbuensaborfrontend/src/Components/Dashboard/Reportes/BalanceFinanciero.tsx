import { useEffect, useMemo, useState } from "react";
import {
    fetchBalanceFinanciero,
    type ReporteBalanceFinancieroDTO,
} from "../../../services/reportesService";

const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 2,
    }).format(value);

const BalanceFinanciero = () => {
    const today = useMemo(() => formatDateInput(new Date()), []);
    const [desde, setDesde] = useState(today);
    const [hasta, setHasta] = useState(today);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ReporteBalanceFinancieroDTO>({
        ingresos: 0,
        costos: 0,
        ganancias: 0,
    });

    const loadData = async () => {
        if (!desde || !hasta) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchBalanceFinanciero(desde, hasta);
            setData(response);
        } catch (err: any) {
            setError(err.response?.data?.message ?? "No se pudo cargar el balance financiero.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="dashboard-table-card">
            <div className="dashboard-table-header d-flex flex-column flex-md-row align-items-md-center gap-3 justify-content-between">
                <h5 className="mb-1">Balance financiero</h5>
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

            <div className="row g-3">
                <div className="col-12 col-md-4">
                    <div className="border rounded p-3 h-100">
                        <p className="text-muted mb-1">Ingresos</p>
                        <h4 className="mb-0">{formatCurrency(data.ingresos)}</h4>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="border rounded p-3 h-100">
                        <p className="text-muted mb-1">Costos</p>
                        <h4 className="mb-0">{formatCurrency(data.costos)}</h4>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="border rounded p-3 h-100">
                        <p className="text-muted mb-1">Ganancias</p>
                        <h4 className="mb-0">{formatCurrency(data.ganancias)}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalanceFinanciero;