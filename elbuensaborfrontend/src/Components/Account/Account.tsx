import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UsuarioContext";
import { getUserService, updateUser } from "../../services/userService";
import type { UsuarioDTO } from "../../dtos/UsuarioDTO";
import { getLocalidades } from "../../services/authService";
import { HiOutlineUserCircle } from "react-icons/hi";
import type { UserEditRequestDTO } from "../../dtos/UserEditRequestDTO";

import "./account.css";

const Account = () => {
    const [userData, setUserData] = useState<UsuarioDTO | null>(null);

    const [localidades, setLocalidades] = useState([
        {
            id: 0,
            nombre: "",
        },
    ]);

    const { user, logout } = useUser();

    const [editMode, setEditMode] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState<{ type: "" | "success" | "error"; text: string }>({
        type: "",
        text: "",
    });

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (pass: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        return regex.test(pass);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editMode) return;

        setMsg({ type: "", text: "" });

        try {
            if (!userData) return;

            if (!validateEmail(userData.email)) {
                setMsg({
                    type: "error",
                    text: "El email no tiene un formato válido.",
                });
                return;
            }

            if (password || confirmPassword) {
                if (password !== confirmPassword) {
                    setMsg({
                        type: "error",
                        text: "Las contraseñas no coinciden.",
                    });
                    return;
                }

                if (!validatePassword(password)) {
                    setMsg({
                        type: "error",
                        text:
                            "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.",
                    });
                    return;
                }
            }

            const payload: UserEditRequestDTO = {
                username: userData.username,
                nombre: userData.nombre,
                apellido: userData.apellido,
                email: userData.email,
                telefono: userData.telefono,
                rolSistema: userData.rolSistema,
                domicilio: {
                    calle: userData.domicilio.calle,
                    numero: userData.domicilio.numero,
                    codigoPostal: userData.domicilio.codigoPostal,
                    localidadId: userData.domicilio.localidad.id,
                },
                perfilEmpleado: (userData as any).perfilEmpleado ?? null,
                sucursalId:
                    (userData as any).sucursalId ??
                    (userData as any).sucursal?.id ??
                    1,
            };

            if (password.trim() !== "") {
                payload.password = password;
            }

            const updated = await updateUser(userData.id, payload);
            console.log("Usuario actualizado:", updated);

            setMsg({
                type: "success",
                text: "Los datos se actualizaron correctamente.",
            });

            if (user && user.username !== userData.username) {
                logout();
            } else {
                setEditMode(false);
                setPassword("");
                setConfirmPassword("");
            }

        } catch (error: any) {
            console.error("error", error);
            setMsg({
                type: "error",
                text:
                    error?.response?.data?.message ||
                    "Error al actualizar el usuario. Intenta nuevamente.",
            });
        }
    };

    const getUser = async () => {
        setMsg({ type: "", text: "" });
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

    const handleCancelEdit = () => {
        setEditMode(false);
        setPassword("");
        setConfirmPassword("");
        getUser();
        setMsg({ type: "", text: "" });
    };

    if (!userData) {
        return (
            <div className="account-container">
                <div className="header-account">
                    <h4>Mi Perfil</h4> <HiOutlineUserCircle className="header-icon" />
                </div>
                <hr />
                <p>Cargando información...</p>
            </div>
        );
    }

    return (
        <div className="account-container">
            <div className="header-account">
                <h4>Mi Perfil</h4> <HiOutlineUserCircle className="header-icon" />
            </div>
            <hr />

            <div style={{ marginBottom: "10px" }}>
                {!editMode ? (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditMode(true)}
                    >
                        Editar perfil
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancelEdit}
                    >
                        Cancelar edición
                    </button>
                )}
            </div>

            <div>
                <form onSubmit={handleSubmit}>
                    <div className="row-account">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={userData.email}
                            className="form-control"
                            onChange={handleChange}
                            disabled={!editMode}
                        />
                        <label htmlFor="username" className="form-label">
                            Nombre de usuario
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Nombre de usuario"
                            value={userData.username}
                            className="form-control"
                            onChange={handleChange}
                            disabled={!editMode}
                        />
                    </div>

                    <div className="row-account">
                        <label htmlFor="nombre" className="form-label">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={userData.nombre}
                            className="form-control"
                            onChange={handleChange}
                            disabled={!editMode}
                        />
                        <label htmlFor="apellido" className="form-label">
                            Apellido
                        </label>
                        <input
                            type="text"
                            name="apellido"
                            placeholder="Apellido"
                            value={userData.apellido}
                            className="form-control"
                            onChange={handleChange}
                            disabled={!editMode}
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
                            value={userData.telefono}
                            className="form-control"
                            onChange={handleChange}
                            disabled={!editMode}
                        />
                        <label htmlFor="calle" className="form-label">
                            Calle
                        </label>
                        <input
                            type="text"
                            name="calle"
                            placeholder="Calle"
                            value={userData.domicilio.calle}
                            className="form-control"
                            onChange={handleChange}
                            disabled={!editMode}
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
                            value={userData.domicilio.numero}
                            className="form-control"
                            onChange={handleChange}
                            disabled={!editMode}
                        />
                        <label htmlFor="codigoPostal" className="form-label">
                            Código postal
                        </label>
                        <input
                            type="number"
                            name="codigoPostal"
                            placeholder="Código postal"
                            value={userData.domicilio.codigoPostal}
                            className="form-control"
                            onChange={handleChange}
                            disabled={!editMode}
                        />
                    </div>

                    <div className="row-account">
                        <label htmlFor="localidad" className="form-label">
                            Localidad
                        </label>
                        <select
                            name="localidad"
                            value={userData.domicilio.localidad.id}
                            className="form-control"
                            onChange={handleChange}
                            disabled={!editMode}
                        >
                            <option value={0}>Selecciona una localidad</option>
                            {localidades.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Cambio de contraseña */}
                    <div className="row-account">
                        <label htmlFor="password" className="form-label">
                            Nueva contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Nueva contraseña"
                            value={password}
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={!editMode}
                        />
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            className="form-control"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={!editMode}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!editMode}
                    >
                        Guardar
                    </button>

                    {msg.text && (
                        <p
                            className={
                                msg.type === "error"
                                    ? "account-msg-error"
                                    : "account-msg-success"
                            }
                        >
                            {msg.text}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Account;
