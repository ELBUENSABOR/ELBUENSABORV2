import { useNavigate } from "react-router-dom";
import "./auth.css";
import type { LoginRequest } from "../../dtos/LoginRequest";
import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useUser } from "../../contexts/UsuarioContext";

const Login = () => {
  const [form, setForm] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setUser } = useUser();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({
    state: "",
    msg: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      const resp = await loginUser(payload);
      setMsg((prev) => ({
        ...prev,
        state: "success",
        msg: "¡Login exitoso!",
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
      }, 500);
    } catch (err: any) {
      setMsg((prev) => ({
        ...prev,
        state: "error",
        msg: err.response?.data?.message || "Error al iniciar sesion",
      }));
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="form-container-auth">
        <h2>Iniciar sesión</h2>
        <hr />
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
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
        <button type="submit" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
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

export default Login;
