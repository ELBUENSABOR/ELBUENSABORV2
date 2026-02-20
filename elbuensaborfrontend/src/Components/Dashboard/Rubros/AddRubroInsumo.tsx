import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import type {Rubro} from "../../../models/Rubro";
import {useUser} from "../../../contexts/UsuarioContext";
import {
    createRubro,
    getRubroInsumoById,
    updateRubro,
} from "../../../services/rubrosService";

const initialState: Rubro = {
    id: 0,
    denominacion: "",
    categoriaPadreId: null,
    activo: true,
};

const AddRubroInsumo = () => {
    const {id, parentId} = useParams<{ id?: string; parentId?: string }>();

    const isEdit = Boolean(id);
    const isSubrubro = Boolean(parentId);

    const [form, setForm] = useState<Rubro>(initialState);
    const [parentData, setParentData] = useState<Rubro>(initialState);
    const navigate = useNavigate();
    const {user} = useUser();
    const token = user?.token;

    // Si es subrubro, setear categoriaPadreId desde la URL
    useEffect(() => {
        const setParent = async () => {
            if (isSubrubro) {
                setForm((prev) => ({
                    ...prev,
                    categoriaPadreId: Number(parentId),
                }));

                const parentRes = await getRubroInsumoById(Number(parentId));
                setParentData(parentRes.data);

                console.log("parentRes", parentRes);
            }
        };
        setParent();
    }, [parentId, isSubrubro]);

    useEffect(() => {
        if (!isEdit || !token) return;

        const getData = async () => {
            try {
                const res = await getRubroInsumoById(Number(id));
                setForm(res.data);
            } catch (error) {
                console.error("Error al cargar rubro", error);
            }
        };

        getData();
    }, [id, token, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEdit) {
                await updateRubro(Number(id), form);
            } else {
                await createRubro(form);
            }
            navigate("/dashboard/rubros-insumos");
        } catch (error) {
            console.error("Error al guardar rubro", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded mt-4">
            <h2 className="mb-4">
                {isEdit
                    ? "Editar Rubro"
                    : isSubrubro
                        ? "Crear Subrubro"
                        : "Crear Nuevo Rubro"}
            </h2>

            <div className="mb-3">
                <label className="form-label">Denominación</label>
                <input
                    name="denominacion"
                    className="form-control"
                    value={form.denominacion}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-check form-switch mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="activo"
                    id="rubro-activo-insumo"
                    checked={Boolean(form.activo)}
                    onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="rubro-activo-insumo">
                    Rubro activo
                </label>
            </div>

            {isSubrubro && (
                <div className="alert alert-info">
                    Este subrubro pertenece al rubro{" "}
                    <strong>{parentData.denominacion}</strong>
                </div>
            )}

            <div className="mt-3 d-flex gap-2">
                <button className="btn btn-primary" type="submit">
                    {isEdit ? "Guardar Cambios" : "Crear"}
                </button>
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => navigate("/dashboard/rubros-insumos")}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default AddRubroInsumo;