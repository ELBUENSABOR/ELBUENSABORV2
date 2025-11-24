import { useEffect, useState } from "react";
import { registerUser, getLocalidades } from "../../services/authService";
import "./auth.css";
import type { RegisterRequest } from "../../dtos/RegisterRequest";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UsuarioContext";

const Register = () => {
  const [form, setForm] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    telefono: "",
    calle: "",
    codigoPostal: 0,
    localidad: 0,
    numero: "",
  });
  const [localidades, setLocalidades] = useState([
    {
      id: 0,
      nombre: "",
    },
  ]);
  const { setUser } = useUser();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({
    state: "",
    msg: "",
  });

  useEffect(() => {
    const getData = async () => {
      const localidadesData = await getLocalidades();
      console.log("localidades", localidadesData);
      setLocalidades(localidadesData);
    };
    try {
    } catch (error) {
      console.error("Error al obtener las localidades", error);
    }
    getData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "localidad" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg((prev) => ({
      ...prev,
      state: "",
      msg: "",
    }));

    try {
      const payload = { ...form };
      const resp = await registerUser(payload);
      setMsg((prev) => ({
        ...prev,
        state: "success",
        msg: "¿Registro exitoso!",
      }));
      console.log("resp", resp);
      setUser({
        token: resp.data.token,
        username: resp.data.username,
        role: resp.data.role,
        userId: resp.data.userId,
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      setMsg((prev) => ({
        ...prev,
        state: "error",
        msg: err.response?.data?.message || "Error al registrarse",
      }));
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="form-container-auth">
        <h2>Crear cuenta</h2>
        <hr />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="form-control"
        />

        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          className="form-control"
        />

        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={handleChange}
          className="form-control"
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          className="form-control"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="form-control"
        />

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="form-control"
        />

        <input
          type="text"
          name="calle"
          placeholder="Calle"
          value={form.calle}
          onChange={handleChange}
          className="form-control"
        />

        <input
          type="text"
          name="numero"
          placeholder="Numero"
          value={form.numero}
          onChange={handleChange}
          className="form-control"
        />

        <input
          type="number"
          name="codigoPostal"
          placeholder="Codigo postal"
          value={form.codigoPostal || ""}
          onChange={handleChange}
          className="form-control"
        />

        <select name="localidad" value={form.localidad} onChange={handleChange}>
          <option value={0}>Selecciona una localidad</option>
          {localidades.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.nombre}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        {msg && (
          <p
            className={
              msg.state === "error" ? "error-color-p" : "succes-color-p"
            }
          >
            {msg.msg}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
