import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Sucursal } from "../../../models/Sucursal";
import { useUser } from "../../../contexts/UsuarioContext";
import {
  createSucursal,
  getSucursalById,
  updateSucursal
} from "../../../services/dashboardService";

const initialState: Sucursal = {
  nombre: "",
  horarioApertura: "",
  horarioCierre: "",
};

const AddSucursal = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<Sucursal>(initialState);
  const navigate = useNavigate();
  const user = useUser();
  const token = user.user?.token;

  // Cargar información si estamos editando
  useEffect(() => {
    if (!isEdit || !token) return;

    const getData = async () => {
      try {
        const res = await getSucursalById(Number(id));
        setForm(res.data);
      } catch (error) {
        console.error("Error al cargar sucursal", error);
      }
    };

    getData();
  }, [id, token, isEdit]);

  // Manejar inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateSucursal(Number(id), form);
      } else {
        await createSucursal(form);
      }
      navigate("/dashboard/sucursales");
    } catch (error) {
      console.error("Error al guardar sucursal", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mt-4">
      <h2 className="mb-4">
        {isEdit ? "Editar Sucursal" : "Crear Nueva Sucursal"}
      </h2>

      {/* Nombre */}
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          name="nombre"
          className="form-control"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>

      {/* Horario apertura */}
      <div className="mb-3">
        <label className="form-label">Horario de apertura</label>
        <input
          type="time"
          name="horarioApertura"
          className="form-control"
          value={form.horarioApertura}
          onChange={handleChange}
          required
        />
      </div>

      {/* Horario cierre */}
      <div className="mb-3">
        <label className="form-label">Horario de cierre</label>
        <input
          type="time"
          name="horarioCierre"
          className="form-control"
          value={form.horarioCierre}
          onChange={handleChange}
          required
        />
      </div>

      <button className="btn btn-primary mt-3" type="submit">
        {isEdit ? "Guardar Cambios" : "Crear Sucursal"}
      </button>
    </form>
  );
};

export default AddSucursal;
