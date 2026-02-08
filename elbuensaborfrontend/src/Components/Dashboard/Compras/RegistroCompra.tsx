import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { getAll, registrarCompraInsumo } from '../../../services/insumosService';
import { useSucursal } from '../../../contexts/SucursalContext';
import { useLocation, useNavigate } from 'react-router-dom';
import type { InsumoResponse } from '../../../models/Insumo';

const RegistroCompra = () => {
  const [insumos, setInsumos] = useState<InsumoResponse[]>([]);
  const [selectedInsumoId, setSelectedInsumoId] = useState<number>(0);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(0);
  const [precioCompra, setPrecioCompra] = useState<number>(0);
  const [totalCompra, setTotalCompra] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loadingInsumos, setLoadingInsumos] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  const { sucursalId, sucursales } = useSucursal();
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedInsumoId = (location.state as { insumoId?: number } | null)?.insumoId;

  useEffect(() => {
    fetchInsumos();
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
      setMessage({ type: 'danger', text: 'Error al cargar los insumos.' });
    } finally {
      setLoadingInsumos(false);
    }
  };

  const handleInsumoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedInsumoId(id);

    // Auto-fill price if available
    const selected = insumos.find(i => i.id === id);
    if (selected) {
      setPrecioCompra(selected.precioCompra || 0);
    }
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCantidad(Number(value));
    setTotalCompra(Number(value) * Number(precioCompra));
  };

  const handlePrecioCompraChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrecioCompra(Number(value));
    setTotalCompra(Number(cantidad) * Number(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sucursalId) {
      setMessage({ type: 'danger', text: 'Seleccione una sucursal primero.' });
      return;
    }
    if (!selectedInsumoId || !cantidad) {
      setMessage({ type: 'danger', text: 'Complete los campos obligatorios.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload = {
      insumoId: selectedInsumoId,
      sucursalId,
      cantidad: Number(cantidad),
      precioCompra: precioCompra ? Number(precioCompra) : undefined,
      totalCompra: Number(totalCompra)
    };

    const handleInsumoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setSelectedInsumoId(id);

        // Auto-fill price if available
        const selected = insumos.find(i => i.id === id);
        if (selected) {
            setPrecioCompra(selected.precioCompra || 0);
        }
    };

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setCantidad(Number(value));
        setTotalCompra(Number(value) * Number(precioCompra));
    };

    const handlePrecioCompraChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setPrecioCompra(Number(value));
        setTotalCompra(Number(cantidad) * Number(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sucursalId) {
            setMessage({type: 'danger', text: 'Seleccione una sucursal primero.'});
            return;
        }
        if (!selectedInsumoId || !cantidad) {
            setMessage({type: 'danger', text: 'Complete los campos obligatorios.'});
            return;
        }

        setLoading(true);
        setMessage(null);

        const payload = {
            insumoId: selectedInsumoId,
            sucursalId,
            cantidad: Number(cantidad),
            precioCompra: precioCompra ? Number(precioCompra) : undefined,
            totalCompra: Number(totalCompra)
        };

        try {
            await registrarCompraInsumo(payload);
            setMessage({type: 'success', text: 'Compra registrada con éxito.'});
            setCantidad(0);
            setPrecioCompra(0);
            setSelectedInsumoId(0);
            setTotalCompra(0);
            fetchInsumos(); // Refresh to ensure latest data if needed
        } catch (error) {
            console.error(error);
            setMessage({type: 'danger', text: 'Error al registrar la compra.'});
        } finally {
            setLoading(false);
        }
    };

    const selectedInsumo = insumos.find(i => i.id === Number(selectedInsumoId));

    if (!sucursalId) return <Alert variant="warning">Seleccione una sucursal para continuar.</Alert>;

    return (
        <div>
            <div>
                <h4 className="mb-3">Registrar Compra de Insumos</h4>
                <hr/>
                <div>
                    {message && <Alert variant={message.type} onClose={() => setMessage(null)}
                                       dismissible>{message.text}</Alert>}

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
                                        <Form.Label>Sucursal</Form.Label>
                                        <Form.Select
                                            value={selectedSucursalId}
                                            onChange={(e) => setSelectedSucursalId(Number(e.target.value))}
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
                                <Col className="d-flex gap-2 flex-column">
                                    <Form.Group>
                                        <Form.Label>Insumo</Form.Label>
                                        <div className="d-flex gap-2">
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
                                        </div>
                                    </Form.Group>
                                    <Button variant="success" onClick={() => navigate('/dashboard/insumos/add')}>
                                        + Nuevo insumo
                                    </Button>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Precio Costo</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder="Ingrese el precio de costo"
                                            value={precioCompra}
                                            onChange={(e) => handlePrecioCompraChange(e)}
                                        />
                                        <Form.Text className="text-muted">
                                            Si no se modifica, se mantiene el precio actual.
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Cantidad a comprar</Form.Label>
                                        <div className="d-flex align-items-center gap-2">
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                placeholder="Cantidad"
                                                value={cantidad}
                                                onChange={(e) => handleCantidadChange(e)}
                                                required
                                            />
                                            {selectedInsumo && (
                                                <span className="text-muted text-nowrap">
                          {selectedInsumo.unidadMedida.denominacion}
                        </span>
                                            )}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Total</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder="Total"
                                            value={totalCompra}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-end">
                                <Button variant="primary" type="submit" disabled={loading || !selectedInsumoId}>
                                    {loading ? <Spinner as="span" animation="border" size="sm"/> : 'Registrar Compra'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </div>
            </div>
            <div>
                <button className='btn btn-primary' onClick={() => navigate('/dashboard/compras/list')}>Ver todas las
                    compras
                </button>
            </div>
        </div>
    );
};

export default RegistroCompra;
