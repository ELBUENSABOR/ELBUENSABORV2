import { Modal } from "react-bootstrap";
import type { Ingredientes } from "../../../../models/Insumo";
import "./ingredientesModal.css";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {getImageUrl} from "../../../../utils/image";

const IngredientesModal = ({
                               show,
                               onClose,
                               ingredientes,
                               onSave,
                               ingredientesSelected,
                               setIngredientesSelected,
                           }: {
    show: boolean;
    onClose: () => void;
    ingredientes: Ingredientes[];
    onSave: (ingredientes: Ingredientes[]) => void;
    ingredientesSelected: Ingredientes[];
    setIngredientesSelected: Dispatch<SetStateAction<Ingredientes[]>>;
}) => {

    const [cantidades, setCantidades] = useState<Record<number, number>>({});
    const [selected, setSelected] = useState<number | null>(null);

    useEffect(() => {
        console.log("Ingredientes:", ingredientes);
        console.log("Cantidades:", cantidades);
        console.log("Seleccionados:", ingredientesSelected);
    }, [ingredientes, cantidades, ingredientesSelected]);

    const handleAgregarIngrediente = (ingrediente: Ingredientes) => {
        const cantidad = cantidades[ingrediente.insumoId];
        if (!cantidad || cantidad <= 0) return;

        setIngredientesSelected(prev => {
            const existe = prev.find(i => i.insumoId === ingrediente.insumoId);

            if (existe) {
                return prev.map(i =>
                    i.insumoId === ingrediente.insumoId
                        ? { ...i, cantidad }
                        : i
                );
            }

            return [...prev, { ...ingrediente, cantidad }];
        });

        setSelected(null);
        setCantidades({});
    };

    const handleCantidadChange = (insumoId: number, value: number) => {
        if (value <= 0) return;

        setCantidades(prev => ({
            ...prev,
            [insumoId]: value
        }));
    };

    const handleQuitarIngrediente = (insumoId: number) => {
        setIngredientesSelected(prev => prev.filter((i) => i.insumoId !== insumoId));
        setCantidades(prev => {
            const next = { ...prev };
            delete next[insumoId];
            return next;
        });
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>+ Ingredientes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="ingrediente-container">
                    {ingredientes
                        .filter((ingrediente) => ingrediente.activo)
                        .map((ingrediente, index) => {
                        const seleccionado = ingredientesSelected.find(
                            i => i.insumoId === ingrediente.insumoId
                        );

                        return (
                            <div key={ingrediente.insumoId} className={ingrediente.activo && seleccionado ? "ingrediente-card selected" : ingrediente.activo && !seleccionado ? "ingrediente-card" : "ingrediente-card disabled"}>
                                <div
                                    className="ingrediente-card-header"
                                    onClick={() => setSelected(selected === index ? null : index)}
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        {ingrediente.denominacion}
                                        {Boolean(ingrediente.imagen) && (
                                            <img src={getImageUrl(ingrediente.imagen)} alt={ingrediente.denominacion} className="img-ingrediente" />
                                        )}
                                    </div>
                                    {seleccionado ? (
                                        <div className="ingrediente-card-actions">
                                            <i className="bi bi-check"> ✓</i>
                                            <button
                                                type="button"
                                                className="ingrediente-deselect-btn"
                                                title="Deseleccionar ingrediente"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleQuitarIngrediente(ingrediente.insumoId);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <i className="bi bi-plus"> +</i>
                                    )}
                                </div>

                                {selected === index && (
                                    <div className="ingrediente-info">
                                        <hr />
                                        <p>- Stock actual: {ingrediente.stockActual || 0} {ingrediente.unidadMedida}</p>
                                        <p>Cantidad ({ingrediente.unidadMedida})</p>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Ingrese la cantidad"
                                            value={cantidades[ingrediente.insumoId] ?? seleccionado?.cantidad ?? ingrediente.cantidad ?? ""}
                                            onChange={(e) =>
                                                handleCantidadChange(
                                                    ingrediente.insumoId,
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                        <div className="d-flex gap-2 mt-2">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => handleAgregarIngrediente(ingrediente)}
                                            >
                                                {seleccionado ? "Actualizar" : "Agregar"}
                                            </button>
                                            {seleccionado && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => handleQuitarIngrediente(ingrediente.insumoId)}
                                                >
                                                    Quitar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                        onSave(ingredientesSelected);
                        onClose();
                    }}
                >
                    Guardar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default IngredientesModal;