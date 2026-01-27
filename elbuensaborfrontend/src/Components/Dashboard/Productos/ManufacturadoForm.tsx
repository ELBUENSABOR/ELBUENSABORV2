import { useEffect, useState } from "react";
import type { Manufacturado } from "../../../models/Manufacturado";
import type { Ingredientes } from "../../../models/Insumo";
import { getAll } from "../../../services/insumosService";
import { getRubrosManufacturados } from "../../../services/rubrosService";
import type { Rubro } from "../../../models/Rubro";
import IngredientesModal from "./IngredientesModal/IngredientesModal";
import { createManufacturado, getManufacturadoById, updateManufacturado, uploadImagenesManufacturado } from "../../../services/manufacturadosService";
import { useSucursal } from "../../../contexts/SucursalContext";
import { fetchSucursales } from "../../../services/dashboardService";
import type { Sucursal } from "../../../models/Sucursal";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import type { Imagen } from "../../../models/Imagen";

const initialState: Manufacturado = {
    id: 0,
    denominacion: "",
    descripcion: "",
    receta: "",
    precioCosto: 0,
    precioVenta: 0,
    categoriaId: 0,
    tiempoEstimado: 0,
    activo: false,
    ingredientes: [],
    imagenes: []
}

const BACKEND_URL = "http://localhost:8080";

const ManufacturadoForm = () => {
    const [manufacturado, setManufacturado] = useState<Manufacturado>(initialState);
    const [ingredientes, setIngredientes] = useState<Ingredientes[]>([]);
    const [rubrosManufacturados, setRubrosManufacturados] = useState<Rubro[]>([]);
    const [ingredientesSelected, setIngredientesSelected] = useState<Ingredientes[]>([]);
    const { sucursalId, sucursales: sucursalesContext } = useSucursal();
    const [imagenesActuales, setImagenesActuales] = useState<Imagen[]>([]);
    const [imagenesNuevas, setImagenesNuevas] = useState<File[]>([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();

    const isEdit = Boolean(id);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getAll();
                const rubros = await getRubrosManufacturados();
                const sucursal = await fetchSucursales();
                const sucursalSeleccionada = sucursal.find((sx) => sx.id === sucursalId);
                setSucursalSeleccionada(sucursalSeleccionada || null);

                console.log(response);
                setRubrosManufacturados(rubros.data);

                if (response) {
                    const paraElaborar = response.filter((ingrediente: { esParaElaborar: any; }) => ingrediente.esParaElaborar);
                    const ingredientesValue = paraElaborar.map((ingrediente: {
                        imagenes: any;
                        stockSucursal: any;
                        activo: any;
                        precioCompra: any;
                        unidadMedida: any; id: any; denominacion: any; cantidad: any;
                    }) => {
                        return {
                            insumoId: ingrediente.id,
                            denominacion: ingrediente.denominacion,
                            cantidad: ingrediente.cantidad,
                            unidadMedida: ingrediente.unidadMedida.denominacion,
                            precioCompra: ingrediente.precioCompra,
                            stockActual: ingrediente.stockSucursal.filter((sx: { sucursalId: number | null; }) => sx.sucursalId === sucursalId)[0]?.stockActual,
                            activo: ingrediente.activo,
                            imagenes: ingrediente.imagenes
                        }
                    });
                    setIngredientes(ingredientesValue);
                }

                if (isEdit) {
                    const responseEdit = await getManufacturadoById(id ?? "", sucursalId ?? 0);
                    console.log("responseEdit", responseEdit);
                    setManufacturado(prev => ({
                        ...prev,
                        ...responseEdit,
                        ingredientes: responseEdit.ingredientes.map((i: {
                            insumoDenominacion: any; insumoId: any; cantidad: any; unidadMedida: any; precioCompra: any;
                        }) => ({
                            insumoId: i.insumoId,
                            denominacion: i.insumoDenominacion,
                            cantidad: i.cantidad,
                            unidadMedida: i.unidadMedida,
                            precioCompra: i.precioCompra
                        }))
                    }));
                    setIngredientesSelected(
                        responseEdit.ingredientes.map((i: {
                            insumoDenominacion: string;
                            insumoId: number;
                            cantidad: number;
                            unidadMedida: string;
                            precioCompra: number;
                        }) => ({
                            insumoId: i.insumoId,
                            denominacion: i.insumoDenominacion,
                            cantidad: i.cantidad,
                            unidadMedida: i.unidadMedida,
                            precioCompra: i.precioCompra
                        }))
                    );
                    setImagenesActuales(
                        responseEdit.imagenes.map((url: string) => ({
                            url
                        }))
                    );
                }
            } catch (error) {
                console.error("Error al obtener ingredientes");
            }
        };

        getData();
    }, [])

    const handleSaveIngredientes = (ingredientesSeleccionados: Ingredientes[]) => {
        setManufacturado(prev => ({
            ...prev,
            ingredientes: ingredientesSeleccionados.map(i => ({
                insumoId: i.insumoId,
                denominacion: i.denominacion,
                cantidad: i.cantidad,
                unidadMedida: i.unidadMedida,
                precioCompra: i.precioCompra
            }))
        }));

        const costoTotal = ingredientesSeleccionados.reduce((total, ingrediente) => total + ingrediente.precioCompra * ingrediente.cantidad, 0);
        setManufacturado(prev => ({
            ...prev,
            precioCosto: costoTotal
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                sucursalId: sucursalId,
                denominacion: manufacturado.denominacion,
                descripcion: manufacturado.descripcion,
                receta: manufacturado.receta,
                precioCosto: manufacturado.precioCosto,
                precioVenta: manufacturado.precioVenta,
                tiempoEstimado: manufacturado.tiempoEstimado,
                categoriaId: manufacturado.categoriaId,
                ingredientes: manufacturado.ingredientes?.map(i => ({
                    insumoId: i.insumoId,
                    cantidad: i.cantidad
                })),
                imagenes: manufacturado.imagenes,
                activo: manufacturado.activo
            }
            console.log(payload);
            if (isEdit) {
                await updateManufacturado(id ?? "", payload, sucursalId ?? 0);
                if (imagenesNuevas.length > 0) {
                    await uploadImagenesManufacturado(id ?? "", imagenesNuevas);
                }
                setMessage({ type: 'success', text: 'Manufacturado actualizado con éxito.' });
                setTimeout(() => {
                    navigate('/dashboard/productos-manufacturados');
                }, 2000);
            } else {
                console.log(payload);
                const created = await createManufacturado(payload, sucursalId ?? 0);
                if (imagenesNuevas.length > 0) {
                    await uploadImagenesManufacturado(created.id ?? "", imagenesNuevas);
                }
                setMessage({ type: 'success', text: 'Manufacturado registrado con éxito.' });
                setTimeout(() => {
                    navigate('/dashboard/productos-manufacturados');
                }, 2000);
            }
        } catch (error) {
            console.error("Error al guardar el manufacturado");
            setMessage({ type: 'danger', text: 'Error al guardar el manufacturado.' });
        }
    }

    const handleDeleteIngredient = (insumoId: number) => {
        setManufacturado(prev => ({
            ...prev,
            ingredientes: prev.ingredientes?.filter(i => i.insumoId !== insumoId)
        }));
        setIngredientesSelected(prev => prev.filter(i => i.insumoId !== insumoId));
    }

    return (
        <form className="p-4 border rounded">
            <h2 className="mb-4">{isEdit ? "Editar" : "Crear"} Manufacturado</h2>
            <p>Sucursal seleccionada: <strong>{sucursalSeleccionada?.nombre}</strong></p>
            <hr />
            <div className="mb-3">
                <label htmlFor="denominacion" className="form-label">Denominación</label>
                <input type="text" className="form-control" id="denominacion" value={manufacturado.denominacion} onChange={(e) => setManufacturado({ ...manufacturado, denominacion: e.target.value })} required />
            </div>
            <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <textarea className="form-control" id="descripcion" value={manufacturado.descripcion} onChange={(e) => setManufacturado({ ...manufacturado, descripcion: e.target.value })} required></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="receta" className="form-label">Receta</label>
                <textarea className="form-control" id="receta" value={manufacturado.receta} onChange={(e) => setManufacturado({ ...manufacturado, receta: e.target.value })} required></textarea>
            </div>
            <div className="mb-3">
                <hr />
                <h5>Ingredientes</h5>
                <button type="button" className="btn btn-success" onClick={() => setShowModal(true)}>+ Agregar ingrediente</button>
                <div>
                    <div className="mt-2">
                        <p>Ingredientes añadidos:</p>
                        {
                            manufacturado.ingredientes?.length === 0 ?
                                <p>- No hay ingredientes añadidos</p> :
                                manufacturado.ingredientes?.map((ing) => (
                                    ing.insumoId !== 0 && (
                                        <div key={ing.insumoId} className="mt-2 rounded border p-2 d-flex justify-content-between align-items-center">
                                            <div>{ing.denominacion} – {ing.cantidad} {ing.unidadMedida}</div>
                                            <button className="btn btn-danger" onClick={() => handleDeleteIngredient(ing.insumoId)}>Eliminar</button>
                                        </div>
                                    )
                                ))}
                    </div>
                </div>
                <hr />
            </div>
            <div className="mb-3">
                <label htmlFor="precioCosto" className="form-label">Precio de costo</label>
                <input type="number" className="form-control" id="precioCosto" value={manufacturado.precioCosto} onChange={(e) => setManufacturado({ ...manufacturado, precioCosto: Number(e.target.value) })} required disabled />
            </div>
            <div className="mb-3">
                <label htmlFor="precioVenta" className="form-label">Precio de venta</label>
                <input type="number" className="form-control" id="precioVenta" value={manufacturado.precioVenta} onChange={(e) => setManufacturado({ ...manufacturado, precioVenta: Number(e.target.value) })} required />
            </div>
            <div className="mb-3">
                <label htmlFor="categoriaId" className="form-label">Categoría</label>
                <select className="form-select" id="categoriaId" value={manufacturado.categoriaId} onChange={(e) => setManufacturado({ ...manufacturado, categoriaId: Number(e.target.value) })} required>
                    <option value="">Seleccione</option>
                    {
                        rubrosManufacturados.map((rubro) => (
                            <option key={rubro.id} value={rubro.id}>{rubro.denominacion}</option>
                        ))
                    }
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="tiempoEstimado" className="form-label">Tiempo estimado de preparación (minutos)</label>
                <input type="number" className="form-control" id="tiempoEstimado" value={manufacturado.tiempoEstimado} onChange={(e) => setManufacturado({ ...manufacturado, tiempoEstimado: Number(e.target.value) })} required />
            </div>
            <div className="mb-3">
                <label htmlFor="activo" className="form-label">Activo</label>
                <input type="checkbox" className="form-check-input" id="activo" checked={manufacturado.activo} onChange={(e) => setManufacturado({ ...manufacturado, activo: e.target.checked })} />
            </div>
            <div className="mb-3">
                <label htmlFor="imagenes" className="form-label">
                    Imágenes
                </label>
                <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        setImagenesNuevas(files);
                    }}
                />
                {imagenesNuevas.map((file, i) => (
                    <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        style={{ width: 120, marginTop: 10 }}
                    />
                ))}
                {imagenesActuales.length > 0 && (
                    <div className="mt-3">
                        <p>Imágenes actuales:</p>
                        <div className="d-flex gap-2 flex-wrap">
                            {imagenesActuales.map((img, index) => (
                                <div key={index} className="position-relative">
                                    <img
                                        src={`${BACKEND_URL}${img.url}`}
                                        alt="Imagen producto"
                                        style={{
                                            width: 150,
                                            height: 150,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                            border: "1px solid #ccc"
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {message && <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>{message.text}</Alert>}
            <button type="submit" className="btn btn-primary" disabled={manufacturado.ingredientes.length === 0} onClick={handleSubmit}>Guardar</button>
            <IngredientesModal
                show={showModal}
                onClose={() => setShowModal(false)}
                ingredientes={ingredientes}
                onSave={handleSaveIngredientes}
                setIngredientesSelected={setIngredientesSelected}
                ingredientesSelected={ingredientesSelected}
            />
        </form>
    );
};

export default ManufacturadoForm;