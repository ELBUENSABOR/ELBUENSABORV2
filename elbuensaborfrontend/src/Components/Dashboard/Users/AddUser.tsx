import React, { useEffect, useState } from "react";
import type { UserRequestDTO } from "../../../models/Usuario";
import type { LocalidadDTO } from "../../../dtos/LocalidadDTO";
import { getLocalidades } from "../../../services/authService";
import { createUser } from "../../../services/userService";
import { useNavigate } from "react-router-dom";
import { fetchSucursales } from "../../../services/dashboardService";
import type { Sucursal } from "../../../models/Sucursal";

const initialState: UserRequestDTO = {
  username: "",
  password: "",
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  rolSistema: "CLIENTE",
  perfilEmpleado: "CAJERO",
  sucursalId: 0,
  domicilio: {
    calle: "",
    numero: "",
    codigoPostal: "",
    localidadId: "",
  },
};

export const AddUser: React.FC = () => {
  const [form, setForm] = useState<UserRequestDTO>(initialState);
  const [localidades, setLocalidades] = useState<LocalidadDTO[]>([]);
  const navigate = useNavigate();

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    const getAllLocalidades = async () => {
      try {
        const res = await getLocalidades();
        setLocalidades(res);
      } catch (error) {
        console.error("Error al obtener las localidades");
      }
    };

    const loadData = async () => {
      const res = await fetchSucursales();
      setSucursales(res);
    };

    loadData();
    getAllLocalidades();
  }, []);

  // Cambios generales
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cambios de domicilio
  const handleDomicilioChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      domicilio: {
        ...prev.domicilio!,
        [name]: value,
      },
    }));
  };

  const isCliente = form.rolSistema === "CLIENTE";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si no es cliente, quitamos domicilio
    const payload: UserRequestDTO = {
      ...form,
      domicilio: isCliente ? form.domicilio : undefined,
    };

    try {
      const res = await createUser(payload);
      if (res) {
        console.log("Usuario creado!", res);
        navigate("/dashboard/usuarios");
      }
    } catch (error) {
      console.error("Error al crear el usuario");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 className="mb-4">Crear Usuario</h2>

      {/* ROL */}
      <div className="mb-3">
        <label>Rol del Sistema</label>
        <select
          name="rolSistema"
          className="form-select"
          value={form.rolSistema}
          onChange={handleChange}
        >
          <option value="CLIENTE">Cliente</option>
          <option value="EMPLEADO">Empleado</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* USERNAME */}
      <div className="mb-3">
        <label>Usuario</label>
        <input
          name="username"
          className="form-control"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      {/* PASSWORD */}
      <div className="mb-3">
        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* NOMBRE */}
      <div className="mb-3">
        <label>Nombre</label>
        <input
          name="nombre"
          className="form-control"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>

      {/* APELLIDO */}
      <div className="mb-3">
        <label>Apellido</label>
        <input
          name="apellido"
          className="form-control"
          value={form.apellido}
          onChange={handleChange}
          required
        />
      </div>

      {/* EMAIL */}
      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* TELEFONO */}
      <div className="mb-3">
        <label>Teléfono</label>
        <input
          name="telefono"
          className="form-control"
          value={form.telefono}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Sucursal</label>
        <select
          name="sucursalId"
          className="form-select"
          value={form.sucursalId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar sucursal...</option>

          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* CAMPOS SOLO PARA CLIENTE */}
      {isCliente && (
        <>
          <h4 className="mt-4">Domicilio</h4>

          <div className="mb-3">
            <label>Calle</label>
            <input
              name="calle"
              className="form-control"
              value={form.domicilio?.calle}
              onChange={handleDomicilioChange}
              required={isCliente}
            />
          </div>

          <div className="mb-3">
            <label>Número</label>
            <input
              name="numero"
              className="form-control"
              value={form.domicilio?.numero}
              onChange={handleDomicilioChange}
              required={isCliente}
            />
          </div>

          <div className="mb-3">
            <label>Código Postal</label>
            <input
              type="number"
              name="codigoPostal"
              className="form-control"
              value={form.domicilio?.codigoPostal}
              onChange={handleDomicilioChange}
              required={isCliente}
            />
          </div>

          <div className="mb-3">
            <label>Localidad</label>
            <select
              name="localidadId"
              className="form-select"
              value={form.domicilio?.localidadId}
              onChange={handleDomicilioChange}
              required={isCliente}
            >
              <option value="">Seleccionar...</option>

              {localidades.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nombre}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <button className="btn btn-primary mt-3">Crear Usuario</button>
    </form>
  );
};
