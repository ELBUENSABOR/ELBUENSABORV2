import React, { useEffect, useState } from "react";
import type { UserRequestDTO } from "../../../models/Usuario";
import type { LocalidadDTO } from "../../../dtos/LocalidadDTO";
import { getLocalidades } from "../../../services/authService";
import { getUserService, updateUser } from "../../../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import type { Sucursal } from "../../../models/Sucursal";
import { fetchSucursales } from "../../../services/dashboardService";

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

export const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<UserRequestDTO>(initialState);
  const [localidades, setLocalidades] = useState<LocalidadDTO[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getLocalidades();
        setLocalidades(res);

        const resSucursales = await fetchSucursales();
        setSucursales(resSucursales);

        const userData = await getUserService(userId.toString());
        console.log("user data", userData);
        if (userData.data.rolSistema === "EMPLEADO") {
          // empleado NO tiene domicilio → cargo todo como viene
          setForm({
            ...userData.data,
            domicilio: {
              calle: "",
              numero: "",
              codigoPostal: "",
              localidadId: "",
            },
          });
        } else {
          // cliente o admin → cargo datos + domicilio
          const user = userData.data;

          setForm({
            ...user,
            domicilio: {
              calle: user.domicilio?.calle ?? "",
              numero: user.domicilio?.numero ?? "",
              codigoPostal: user.domicilio?.codigoPostal ?? "",
              localidadId: user.domicilio?.localidad?.id ?? "",
            },
          });
        }
      } catch (error) {
        console.error("Error al obtener las localidades");
      }
    };
    getData();
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
      const res = await updateUser(userId, payload);
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
        <input
          type="text"
          name="rolSistema"
          className="form-control"
          value={form.rolSistema}
          onChange={handleChange}
          disabled
        />
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
          value={form.sucursalId || 0}
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

      <button className="btn btn-primary mt-3">Actualizar Usuario</button>
    </form>
  );
};
