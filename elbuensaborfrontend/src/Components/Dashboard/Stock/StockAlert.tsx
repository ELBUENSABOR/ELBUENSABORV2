import {useEffect, useMemo, useState, type ChangeEvent} from "react";
import {Alert, Button, Form, Spinner} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useSucursal} from "../../../contexts/SucursalContext";
import type {InsumoResponse} from "../../../models/Insumo";
import {getAll} from "../../../services/insumosService";

const StockAlert = () => {
    const [insumos, setInsumos] = useState<InsumoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [thresholdPercent, setThresholdPercent] = useState(20);
    const {sucursales, sucursalId, setSucursalId, loading: loadingSucursal} = useSucursal();
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        const fetchInsumos = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAll();
                if (mounted) {
                    setInsumos(data);
                }
            } catch (err) {
                console.error("Error al obtener insumos", err);
                if (mounted) {
                    setError("No se pudieron cargar los insumos.");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchInsumos();

        return () => {
            mounted = false;
        };
    }, []);

    const handleSucursalChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSucursalId(value ? Number(value) : null);
    };

    const {lowStock, nearStock} = useMemo(() => {
        if (!sucursalId) {
            return {lowStock: [], nearStock: []};
        }

        const low: Array<InsumoResponse & {
            stockActual: number;
            stockMinimo: number;
        }> = [];
        const near: Array<InsumoResponse & {
            stockActual: number;
            stockMinimo: number;
        }> = [];

        insumos.forEach((insumo) => {
            const stock = insumo.stockSucursal.find((s) => s.sucursalId === sucursalId);
            const stockActual = stock?.stockActual ?? 0;
            const stockMinimo = stock?.stockMinimo ?? 0;

            if (stockMinimo <= 0) return;

            const limiteCercano = stockMinimo * (1 + thresholdPercent / 100);
            if (stockActual < stockMinimo) {
                low.push({...insumo, stockActual, stockMinimo});
            } else if (stockActual <= limiteCercano) {
                near.push({...insumo, stockActual, stockMinimo});
            }
        });

        return {lowStock: low, nearStock: near};
    }, [insumos, sucursalId, thresholdPercent]);

    const renderTable = (
        items: Array<InsumoResponse & { stockActual: number; stockMinimo: number }>,
        emptyMessage: string
    ) => {
        if (items.length === 0) {
            return <Alert variant="light" className="mb-0">{emptyMessage}</Alert>;
        }

        return (
            <div className="table-responsive">
                <table className="table table-hover dashboard-table">
                    <thead>
                    <tr>
                        <th>Ingrediente</th>
                        <th>Unidad</th>
                        <th>Stock mínimo</th>
                        <th>Stock actual</th>
                        <th>Diferencia</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((insumo) => {
                        const diferencia = insumo.stockActual - insumo.stockMinimo;
                        return (
                            <tr key={insumo.id ?? insumo.denominacion}>
                                <td>{insumo.denominacion}</td>
                                <td>{insumo.unidadMedida.denominacion}</td>
                                <td>{insumo.stockMinimo}</td>
                                <td>{insumo.stockActual}</td>
                                <td className={diferencia < 0 ? "text-danger fw-semibold" : "text-warning fw-semibold"}>
                                    {diferencia}
                                </td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => navigate("/dashboard/compras", {state: {insumoId: insumo.id}})}
                                    >
                                        Registrar compra
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                <div>
                    <h5 className="mb-1">Control de stock de ingredientes</h5>
                    <p className="text-muted mb-0">
                        Se muestran los ingredientes con stock por debajo del mínimo o cercanos al mínimo.
                    </p>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                        <label className="mb-0 text-muted" htmlFor="sucursal-select">
                            Sucursal:
                        </label>
                        <select
                            id="sucursal-select"
                            className="form-select form-select-sm w-auto"
                            value={sucursalId ?? ""}
                            onChange={handleSucursalChange}
                            disabled={loadingSucursal || sucursales.length === 0}
                        >
                            <option value="">Seleccione</option>
                            {sucursales.map((sucursal) => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                        {loadingSucursal && <span className="text-muted small">cargando...</span>}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Form.Label className="mb-0 text-muted" htmlFor="threshold-select">
                            Umbral cercano:
                        </Form.Label>
                        <Form.Select
                            id="threshold-select"
                            size="sm"
                            className="w-auto"
                            value={thresholdPercent}
                            onChange={(event) => setThresholdPercent(Number(event.target.value))}
                        >
                            <option value={10}>10%</option>
                            <option value={20}>20%</option>
                            <option value={30}>30%</option>
                            <option value={50}>50%</option>
                        </Form.Select>
                    </div>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {!sucursalId && !loadingSucursal && (
                <Alert variant="warning">Seleccione una sucursal para continuar.</Alert>
            )}

            {!sucursalId ? null : loading ? (
                <div className="text-center p-3">
                    <Spinner animation="border" variant="primary"/>
                    <p className="mt-2">Cargando insumos...</p>
                </div>
            ) : (
                <>
                    <div className="dashboard-table-card mb-4">
                        <div className="dashboard-table-header">Stock bajo</div>
                        {renderTable(
                            lowStock,
                            "No hay ingredientes con stock por debajo del mínimo."
                        )}
                    </div>
                    <div className="dashboard-table-card">
                        <div className="dashboard-table-header">
                            Cerca del mínimo ({thresholdPercent}%)
                        </div>
                        {renderTable(
                            nearStock,
                            "No hay ingredientes cercanos al stock mínimo."
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default StockAlert;