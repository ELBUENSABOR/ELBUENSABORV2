import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UsuarioContext";
import { getUserService, updateUser } from "../../services/userService";
import type { UsuarioDTO } from "../../dtos/UsuarioDTO";
import { getLocalidades } from "../../services/authService";
import { HiOutlineUserCircle } from "react-icons/hi";
import "./accouns.css";

const Account = () => {
  const [userData, setUserData] = useState<UsuarioDTO | null>(null);

  const [localidades, setLocalidades] = useState([
    {
      id: 0,
      nombre: "",
    },
  ]);

  const { user } = useUser();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
    try {
      if (!userData) return;
      const updatedUser = await updateUser(userData.id, userData);
      console.log("update user", updatedUser);
    } catch (error) {
      alert("Error al actualizar el usuario");
      console.error("error", error);
    }
  };

  const getUser = async () => {
    const resp = await getUserService(user?.userId || "");
    console.log("resp", resp);
    setUserData(resp.data);

    const localidadesData = await getLocalidades();
    if (localidadesData) {
      setLocalidades(localidadesData);
    }
  };

  useEffect(() => {
    getUser();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    setUserData((prev) => {
      if (!prev) return prev;

      // fields that belong to domicilio
      if (name === "calle" || name === "numero") {
        return {
          ...prev,
          domicilio: {
            ...prev.domicilio,
            [name]: value,
          },
        } as UsuarioDTO;
      }

      if (name === "codigoPostal") {
        return {
          ...prev,
          domicilio: {
            ...prev.domicilio,
            codigoPostal: Number(value) || 0,
          },
        } as UsuarioDTO;
      }

      // update localidad (select returns an id)
      if (name === "localidad") {
        return {
          ...prev,
          domicilio: {
            ...prev.domicilio,
            localidad: {
              ...prev.domicilio.localidad,
              id: Number(value) || 0,
            },
          },
        } as UsuarioDTO;
      }

      return {
        ...(prev as any),
        [name]: value,
      } as UsuarioDTO;
    });
  };

  return (
    <div className="account-container">
      <div className="header-account">
        <h4>Mi Perfil</h4> <HiOutlineUserCircle className="header-icon" />
      </div>
      <hr />
      <div>
        <form onSubmit={handleSubmit}>
          <div className="row-account">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={userData?.nombre}
              className="form-control"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="apellido" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={userData?.apellido}
              className="form-control"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="row-account">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={userData?.email}
              className="form-control"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="username" className="form-label">
              Nombre de usuario
            </label>
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={userData?.username}
              className="form-control"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="row-account">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={userData?.telefono}
              className="form-control"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="calle" className="form-label">
              Calle
            </label>
            <input
              type="text"
              name="calle"
              placeholder="Calle"
              value={userData?.domicilio.calle}
              className="form-control"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="row-account">
            <label htmlFor="numero" className="form-label">
              Número
            </label>
            <input
              type="text"
              name="numero"
              placeholder="Número"
              value={userData?.domicilio.numero}
              className="form-control"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="codigoPostal" className="form-label">
              Código postal
            </label>
            <input
              type="number"
              name="codigoPostal"
              placeholder="Código postal"
              value={userData?.domicilio.codigoPostal}
              className="form-control"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="row-account">
            <label htmlFor="localidad" className="form-label">
              Localidad
            </label>
            <select
              name="localidad"
              value={userData?.domicilio.localidad.id}
              className="form-control"
              onChange={(e) => handleChange(e)}
            >
              <option value="">Selecciona una localidad</option>
              {localidades.map((loc) => (
                <option value={loc.id}>{loc.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;
