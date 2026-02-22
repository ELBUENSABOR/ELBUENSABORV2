import React, {useState, useEffect} from 'react';
import {Form, Button, Row, Col, Alert, Spinner, Table} from 'react-bootstrap';
import {getAll, getAllComprasInsumos, registrarCompraInsumo} from '../../../services/insumosService';
import {useSucursal} from '../../../contexts/SucursalContext';
import {useLocation, useNavigate} from 'react-router-dom';
import type {InsumoResponse} from '../../../models/Insumo';
import type {CompraInsumo} from '../../../models/CompraInsumo';
import './RegistroCompra.css';

const RegistroCompra = () => {
    const [insumos, setInsumos] = useState<InsumoResponse[]>([]);
    const [selectedInsumoId, setSelectedInsumoId] = useState<number>(0);
    const [cantidad, setCantidad] = useState<number>(0);
    const [precioCompra, setPrecioCompra] = useState<number>(0);
    const [totalCompra, setTotalCompra] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [loadingInsumos, setLoadingInsumos] = useState(true);
    const [loadingCompras, setLoadingCompras] = useState(true);
    const [compras, setCompras] = useState<CompraInsumo[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

    const {sucursalId, sucursales, setSucursalId} = useSucursal();
    const navigate = useNavigate();
    const location = useLocation();
    const preselectedInsumoId = (location.state as { insumoId?: number } | null)?.insumoId;

    useEffect(() => {
        fetchInsumos();
        fetchCompras();
    }, [sucursalId]);

    useEffect(() => {
        if (!preselectedInsumoId || insumos.length === 0) return;
        const selected = insumos.find(i => i.id === preselectedInsumoId);
        if (!selected) return;
        setSelectedInsumoId(preselectedInsumoId);
        setPrecioCompra(selected.precioCompra || 0);
    }, [preselectedInsumoId, insumos]);

    const fetchInsumos = async () => {
        setLoadingInsumos(true);
        try {
            const data = await getAll();
            setInsumos(data);
        } catch (error) {
            console.error("Error al cargar insumos", error);
            setMessage({type: 'danger', text: 'Error al cargar los insumos.'});
        } finally {
            setLoadingInsumos(false);
        }
    };

    const fetchCompras = async () => {
        setLoadingCompras(true);
        try {
            const data = await getAllComprasInsumos();
            setCompras(data);
        } catch (error) {
            console.error('Error al cargar compras', error);
        } finally {
            setLoadingCompras(false);
        }
    };

    const handleInsumoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = Number(e.target.value);
      setSelectedInsumoId(id);

      // Auto-fill price if available
      const selected = insumos.find((i) => i.id === id);
      if (selected) {
        setPrecioCompra(selected.precioCompra || 0);
      }
    };

    const handleCantidadChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const value = e.target.value;
      setCantidad(Number(value));
      setTotalCompra(Number(value) * Number(precioCompra));
    };

    const handlePrecioCompraChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const value = e.target.value;
      setPrecioCompra(Number(value));
      setTotalCompra(Number(cantidad) * Number(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!sucursalId) {
        setMessage({
          type: "danger",
          text: "Seleccione una sucursal primero.",
        });
        return;
      }
      if (!selectedInsumoId || !cantidad) {
        setMessage({
          type: "danger",
          text: "Complete los campos obligatorios.",
        });
        return;
      }

      setLoading(true);
      setMessage(null);

      const payload = {
        insumoId: selectedInsumoId,
        sucursalId,
        cantidad: Number(cantidad),
        precioCompra: precioCompra ? Number(precioCompra) : undefined,
        totalCompra: Number(totalCompra),
      };

        try {
            await registrarCompraInsumo(payload);
            setMessage({type: 'success', text: 'Compra registrada con éxito.'});
            setCantidad(0);
            setPrecioCompra(0);
            setSelectedInsumoId(0);
            setTotalCompra(0);
            fetchInsumos(); // Refresh to ensure latest data if needed
            fetchCompras();
        } catch (error) {
            console.error(error);
            setMessage({type: 'danger', text: 'Error al registrar la compra.'});
        } finally {
            setLoading(false);
        }
    };

    const hasSucursal = Boolean(sucursalId);

    return (
        <div className="registro-compra">

            <section className="registro-compra__card">
                <div className="registro-compra__card-header">
                    <div>
                        <h5>Nueva Compra</h5>
                        <p>Seleccione un ingrediente y registre la cantidad comprada. El stock se actualizará
                            automáticamente.</p>
                    </div>
                </div>

                {!hasSucursal && (
                    <Alert variant="warning">Seleccione una sucursal para continuar.</Alert>
                )}

                {message && (
                    <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                        {message.text}
                    </Alert>
                )}

                {loadingInsumos ? (
                    <div className="text-center p-3">
                        <Spinner animation="border" variant="primary"/>
                        <p className="mt-2">Cargando insumos...</p>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Sucursal *</Form.Label>
                                    <Form.Select
                                        value={sucursalId ?? ''}
                                        onChange={(e) => setSucursalId(Number(e.target.value) || null)}
                                        required
                                    >
                                        <option value="">Seleccione una sucursal...</option>
                                        {sucursales.map((sucursal) => (
                                            <option key={sucursal.id} value={sucursal.id}>
                                                {sucursal.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-end">
                            <Col md={9}>
                                <Form.Group>
                                    <Form.Label>Ingrediente *</Form.Label>
                                    <Form.Select
                                        value={selectedInsumoId}
                                        onChange={handleInsumoChange}
                                        required
                                    >
                                        <option value="">Seleccione un insumo...</option>
                                        {insumos.map((insumo) => (
                                            <option key={insumo.id} value={insumo.id}>
                                                {insumo.denominacion} ({insumo.unidadMedida.denominacion})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3} className="d-flex justify-content-end">
                                <Button className="registro-compra__new" variant="outline-success"
                                        onClick={() => navigate('/dashboard/insumos/add')}>
                                    + Nuevo ingrediente
                                </Button>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Cantidad Comprada *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        placeholder="Ej: 10"
                                        value={cantidad}
                                        onChange={(e) => handleCantidadChange(e)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Precio de Costo (por unidad) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        placeholder="Ej: 15.50"
                                        value={precioCompra}
                                        onChange={(e) => handlePrecioCompraChange(e)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Precio Total</Form.Label>
                                    <Form.Control
                                        className="registro-compra__total"
                                        type="text"
                                        value={`$${totalCompra.toFixed(2)}`}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="registro-compra__actions">
                            <Button
                                className="registro-compra__clear"
                                variant="outline-secondary"
                                type="button"
                                onClick={() => {
                                    setCantidad(0);
                                    setPrecioCompra(0);
                                    setSelectedInsumoId(0);
                                    setTotalCompra(0);
                                }}
                            >
                                Limpiar
                            </Button>
                            <Button variant="primary" type="submit" disabled={loading || !selectedInsumoId}>
                                {loading ? <Spinner as="span" animation="border" size="sm"/> : 'Registrar Compra'}
                            </Button>
                        </div>
                    </Form>
                )}
            </section>

            <section className="registro-compra__card">
                <div className="registro-compra__card-header">
                    <div>
                        <h5>Últimas Compras Registradas</h5>
                        <p>Revisa rápidamente los últimos movimientos ingresados.</p>
                    </div>
                    <Button variant="outline-primary" onClick={() => navigate('/dashboard/compras/list')}>
                        Ver todas las compras
                    </Button>
                </div>

                {loadingCompras ? (
                    <div className="text-center p-3">
                        <Spinner animation="border" variant="primary"/>
                        <p className="mt-2">Cargando compras...</p>
                    </div>
                ) : (
                    <Table responsive className="registro-compra__table" borderless>
                        <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Sucursal</th>
                            <th>Ingrediente</th>
                            <th>Cantidad</th>
                            <th>Precio Total</th>
                            <th>Proveedor</th>
                        </tr>
                        </thead>
                        <tbody>
                        {compras.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                    No hay compras registradas
                                </td>
                            </tr>
                        )}
                        {compras.slice(0, 5).map((compra) => (
                            <tr key={compra.id}>
                                <td>{new Date(compra.fechaCompra).toLocaleDateString('es-AR')}</td>
                                <td>{compra.sucursal.nombre}</td>
                                <td>{compra.insumo.denominacion}</td>
                                <td>
                                    {compra.cantidad} {compra.insumo.unidadMedida.denominacion}
                                </td>
                                <td>${compra.totalCompra.toFixed(2)}</td>
                                <td>—</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </section>
        </div>
    );
};

export default RegistroCompra;
