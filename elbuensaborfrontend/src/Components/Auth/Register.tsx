import {useEffect, useState} from "react";
import {getLocalidades, loginWithGoogle, registerUser} from "../../services/authService";
import "./auth.css";
import type {RegisterRequest} from "../../dtos/RegisterRequest";
import {Link, useNavigate} from "react-router-dom";
import {useUser} from "../../contexts/UsuarioContext";
import GoogleAuthButton from "./GoogleAuthButton";

interface Localidad {
    id: number;
    nombre: string;
}

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

    const [confirmPassword, setConfirmPassword] = useState("");
    const [localidades, setLocalidades] = useState<Localidad[]>([]);

    const {setUser} = useUser();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({
        state: "",
        msg: "",
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const localidadesData = await getLocalidades();
                setLocalidades(localidadesData);
            } catch (error) {
                console.error("Error al obtener las localidades", error);
                setMsg({
                    state: "error",
                    msg: "No se pudieron cargar las localidades.",
                });
            }
        };
        getData();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                name === "localidad" || name === "codigoPostal"
                    ? Number(value)
                    : value,
        }));
    };

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password: string) => {
        // Mín. 8 caracteres, una mayúscula, una minúscula y un símbolo
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg({state: "", msg: ""});

        if (!form.username.trim()) {
            setMsg({
                state: "error",
                msg: "El nombre de usuario es obligatorio.",
            });
            setLoading(false);
            return;
        }

        if (!validateEmail(form.email)) {
            setMsg({
                state: "error",
                msg: "El correo electrónico no tiene un formato válido.",
            });
            setLoading(false);
            return;
        }

        if (!validatePassword(form.password)) {
            setMsg({
                state: "error",
                msg:
                    "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.",
            });
            setLoading(false);
            return;
        }

        if (form.password !== confirmPassword) {
            setMsg({
                state: "error",
                msg: "Las contraseñas no coinciden.",
            });
            setLoading(false);
            return;
        }

        if (!form.localidad || form.localidad === 0) {
            setMsg({
                state: "error",
                msg: "Selecciona una localidad.",
            });
            setLoading(false);
            return;
        }

        try {
            const payload: RegisterRequest = {...form};

            const resp = await registerUser(payload);

            setMsg({
                state: "success",
                msg: "¡Registro exitoso!",
            });

            setUser({
                token: resp.data.token,
                username: resp.data.username,
                role: resp.data.role,
                subRole: resp.data.subRole ?? null,
                userId: resp.data.userId,
                mustChangePassword: resp.data.mustChangePassword,
                sucursalId: resp.data.sucursalId ? Number(resp.data.sucursalId) : null,
            });

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (err: any) {
            setMsg({
                state: "error",
                msg:
                    err.response?.data?.message ||
                    "Error al registrarse. Recordá que el nombre de usuario y el correo deben ser únicos.",
            });
        }

        setLoading(false);
    };

    const handleGoogleRegister = async (credential: string) => {
        setLoading(true);
        setMsg({state: "", msg: ""});
        try {
            const resp = await loginWithGoogle(credential);

            setUser({
                token: resp.data.token,
                username: resp.data.username,
                role: resp.data.role,
                subRole: resp.data.subRole ?? null,
                userId: resp.data.userId,
                mustChangePassword: resp.data.mustChangePassword,
                sucursalId: resp.data.sucursalId ? Number(resp.data.sucursalId) : null,
            });

            navigate("/");
        } catch (err: any) {
            setMsg({
                state: "error",
                msg:
                    err.response?.data?.message ||
                    "Error al registrarse con Google.",
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
                    <p className="auth-subtitle">Creá tu cuenta</p>
                </div>
                <hr/>

                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="form-control"
                    required
                />

                <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    className="form-control"
                    required
                />

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
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={form.email}
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

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control"
                    required
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
                    placeholder="Número"
                    value={form.numero}
                    onChange={handleChange}
                    className="form-control"
                />

                <input
                    type="number"
                    name="codigoPostal"
                    placeholder="Código postal"
                    value={form.codigoPostal || ""}
                    onChange={handleChange}
                    className="form-control"
                />

                <select
                    name="localidad"
                    value={form.localidad}
                    onChange={handleChange}
                    className="form-control"
                    required
                >
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

                <div className="auth-divider">
                    <span>o</span>
                </div>
                <GoogleAuthButton onSuccess={handleGoogleRegister} text="signup_with"/>

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
            <Link className="auth-back" to="/">
                ← Volver a la tienda
            </Link>
        </div>
    );
};

export default Register;
