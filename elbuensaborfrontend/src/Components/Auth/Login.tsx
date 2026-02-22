import {Link, useNavigate} from "react-router-dom";
import "./auth.css";
import type { LoginRequest } from "../../dtos/LoginRequest";
import { useState } from "react";
import { loginUser, loginWithGoogle } from "../../services/authService";
import { useUser } from "../../contexts/UsuarioContext";
import { useLocation } from "react-router-dom";
import {getEmployeeDashboardRoute} from "../../utils/employeePanel";
import GoogleAuthButton from "./GoogleAuthButton";

const Login = () => {
    const { state } = useLocation();
    const [form, setForm] = useState<LoginRequest>({
        username: "",
        password: "",
    });

    const navigate = useNavigate();
    const {setUser} = useUser();

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({
        state: "",
        msg: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const resolvePostLoginRoute = (role: string, subRole?: string | null) => {
        if (role === "EMPLEADO") {
            return getEmployeeDashboardRoute(role, subRole);
        }
        if (role === "ADMIN") {
            return "/dashboard/home";
        }
        if (state?.redirectTo) {
            return state.redirectTo;
        }
        if (state?.from === "cart") {
            return "/confirm-order";
        }
        return "/";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg({state: "", msg: ""});

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

            const {token, username, role, subRole, userId, mustChangePassword, sucursalId, fotoPerfil} = resp.data;
            const nextUser = {
                token,
                username,
                role,
                subRole,
                userId,
                mustChangePassword,
                sucursalId: sucursalId ? Number(sucursalId) : null,
                fotoPerfil: fotoPerfil ?? null,
            };

            setUser(nextUser);

            setTimeout(() => {
                navigate(resolvePostLoginRoute(role, subRole));
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

    const handleGoogleLogin = async (credential: string) => {
        setLoading(true);
        setMsg({state: "", msg: ""});
        try {
            const resp = await loginWithGoogle(credential);
            const {token, username, role, subRole, userId, mustChangePassword, sucursalId, fotoPerfil} = resp.data;
            const nextUser = {
                token,
                username,
                role,
                subRole,
                userId,
                mustChangePassword,
                sucursalId: sucursalId ? Number(sucursalId) : null,
                fotoPerfil: fotoPerfil ?? null,
            };

            setUser(nextUser);

            navigate(resolvePostLoginRoute(role, subRole));
        } catch (err: any) {
            setMsg({
                state: "error",
                msg:
                    err.response?.data?.message ||
                    "Error al iniciar sesión con Google.",
            });
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="form-container-auth">
                <div className="auth-header">
                    <div className="auth-logo" aria-hidden="true">
                        🍽️
                    </div>
                    <h2 className="auth-title">El buen sabor</h2>
                    <p className="auth-subtitle">Ingresá a tu cuenta</p>
                </div>
                <hr/>
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

                <div className="auth-divider">
                    <span>o</span>
                </div>
                <GoogleAuthButton onSuccess={handleGoogleLogin} text="signin_with" />

                {msg.msg && (
                    <p
                        className={
                            msg.state === "error" ? "error-color-p" : "succes-color-p"
                        }
                    >
                        {msg.msg}
                    </p>
                )}

                <p className="auth-footer">
                    ¿No tenés cuenta?{" "}
                    <Link className="auth-link" to="/register">
                        Registrate
                    </Link>
                </p>

            </form>
            <Link className="auth-back" to="/">
                ← Volver a la tienda
            </Link>
        </div>
    );
};

export default Login;
