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
        setMsg({ state: "", msg: "" });

        if (!form.username.trim()) {
            setMsg({
                state: "error",
                msg: "Por favor ingresá tu nombre de usuario.",
            });
            setLoading(false);
            return;
        }

        try {
            const resp = await loginUser(form);

            setMsg({
                state: "success",
                msg: "¡Login exitoso!",
            });

            // 👇 Desestructuramos lo que devuelve el back (incluyendo mustChangePassword)
            const { token, username, role, subRole, userId, mustChangePassword } = resp.data;

            // 👇 Guardamos el usuario completo en contexto (con el flag)
            setUser({
                token,
                username,
                role,
                subRole,
                userId,
                mustChangePassword,
            });

            setTimeout(() => {
                navigate("/");
            }, 500);

        } catch (err: any) {
            setMsg({
                state: "error",
                msg:
                    err.response?.data?.message ||
                    "Error al iniciar sesión. Verifica tu usuario y contraseña.",
            });
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
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>

                {msg.msg && (
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
