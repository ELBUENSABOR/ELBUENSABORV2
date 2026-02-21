import React, { useEffect, useState } from "react";
import type { UserRequestDTO } from "../../../models/Usuario";
import type { LocalidadDTO } from "../../../dtos/LocalidadDTO";
import { getLocalidades } from "../../../services/authService";
import { createUser } from "../../../services/userService";
import { useNavigate } from "react-router-dom";
import { fetchSucursales } from "../../../services/dashboardService";
import type { Sucursal } from "../../../models/Sucursal";
import axios from "axios";

const initialState: UserRequestDTO = {
    username: "",
    password: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rolSistema: "CLIENTE",
    perfilEmpleado: "CAJERO",
    sucursalId: undefined,
    domicilio: {
        calle: "",
        numero: "",
        codigoPostal: 0,
        localidadId: 0,
    },
};

export const AddUser: React.FC = () => {
    const [form, setForm] = useState<UserRequestDTO>(initialState);
    const [localidades, setLocalidades] = useState<LocalidadDTO[]>([]);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const navigate = useNavigate();

    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const isCliente = form.rolSistema === "CLIENTE";
    const isEmpleado = form.rolSistema === "EMPLEADO";

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

    // Validadores
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (pass: string) => {
        // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un símbolo
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        return regex.test(pass);
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        // 💡 Validaciones de la HU

        // 1) Email con formato correcto
        if (!validateEmail(form.email)) {
            setErrorMsg("El email no tiene un formato válido.");
            return;
        }

        // 2) Confirmación y fuerza de contraseña
        if (!form.password || !confirmPassword) {
            setErrorMsg("Debes ingresar y confirmar la contraseña provisional.");
            return;
        }

        if (form.password !== confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden.");
            return;
        }

        if (!validatePassword(form.password)) {
            setErrorMsg(
                "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo."
            );
            return;
        }

        // 3) Si no es cliente, quitamos domicilio (empleados / admin no usan domicilio)
        // 4) Si es ADMIN, quitamos sucursalId (solo empleados tienen sucursal)
        const payload: UserRequestDTO = {
            ...form,
            domicilio: isCliente ? form.domicilio : undefined,
            sucursalId: isEmpleado ? form.sucursalId : undefined,
        };

        try {
            const res = await createUser(payload);
            if (res) {
                console.log("Usuario creado!", res);
                navigate("/dashboard/usuarios");
            }
        } catch (err: unknown) {
            console.error("Error al crear el usuario", err);

            let msg = "Error al crear el usuario";

            if (axios.isAxiosError(err) && err.response) {
                const data = err.response.data;

                // Si el back devuelve un mapa de errores (Bean Validation)
                if (data && typeof data === "object" && !Array.isArray(data)) {
                    msg = Object.values(data as Record<string, string>).join("\n");
                }

                // Si el back devuelve { error: "mensaje" } o { message: "mensaje" }
                if ((data as any).error) {
                    msg = (data as any).error as string;
                } else if ((data as any).message) {
                    msg = (data as any).message as string;
                }
            }

            setErrorMsg(msg);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded">
            <h2 className="mb-4">Crear Usuario</h2>

            {/* ROL DEL SISTEMA */}
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

            {/* PERFIL EMPLEADO - SOLO SI ES EMPLEADO */}
            {form.rolSistema === "EMPLEADO" && (
                <div className="mb-3">
                    <label>Rol del empleado</label>
                    <select
                        name="perfilEmpleado"
                        className="form-select"
                        value={form.perfilEmpleado}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccionar rol...</option>
                        <option value="CAJERO">Cajero</option>
                        <option value="COCINERO">Cocinero</option>
                        <option value="DELIVERY">Delivery</option>
                        <option value="ADMINISTRADOR">Administrador</option>
                    </select>
                </div>
            )}

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
                <label>Contraseña provisoria</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-3">
                <label>Confirmar contraseña</label>
                <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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


            {/* SUCURSAL - SOLO PARA EMPLEADOS */}
            {isEmpleado && (
                <div className="mb-3">
                    <label>Sucursal</label>
                    <select
                        name="sucursalId"
                        className="form-select"
                        value={form.sucursalId ?? ""}
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
            )}

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

            {/* Mensajes de error */}
            {
                errorMsg && (
                    <p className="text-danger mt-2" style={{ whiteSpace: "pre-line" }}>
                        {errorMsg}
                    </p>
                )
            }

            <button className="btn btn-primary mt-3">Crear Usuario</button>
        </form >
    );
};
