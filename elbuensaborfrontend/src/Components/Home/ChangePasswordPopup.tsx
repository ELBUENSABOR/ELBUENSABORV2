import { useState } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UsuarioContext.tsx";
import { FiLock } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

export const ChangePasswordPopup = () => {
    const { user, setUser } = useUser();

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const [msg, setMsg] = useState<{ type: "error" | "success" | ""; text: string }>({
        type: "",
        text: "",
    });

    if (!user?.mustChangePassword) return null; // solo si es obligatorio

    const validatePassword = (pass: string) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(pass);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg({ type: "", text: "" });

        if (!oldPass || !newPass || !confirm) {
            setMsg({ type: "error", text: "Debes completar todos los campos." });
            return;
        }

        if (newPass !== confirm) {
            setMsg({ type: "error", text: "Las nuevas contraseñas no coinciden." });
            return;
        }

        if (!validatePassword(newPass)) {
            setMsg({
                type: "error",
                text:
                    "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.",
            });
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `${API_URL}/auth/change-password`,
                { oldPassword: oldPass, newPassword: newPass },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                }
            );

            setUser({
                ...user,
                mustChangePassword: false,
            });

            setMsg({ type: "success", text: "Contraseña actualizada correctamente." });
            setOldPass("");
            setNewPass("");
            setConfirm("");
        } catch (err: any) {
            console.log("Error completo:", err);
            console.log("Error response:", err?.response);
            console.log("Error data:", err?.response?.data);
            console.log("Error status:", err?.response?.status);
            console.log("Error message:", err?.message);
            setMsg({
                type: "error",
                text:
                    err?.response?.data?.message ||
                    "Error al cambiar la contraseña. Verifica la contraseña actual.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="password-modal-backdrop">
            <div className="password-modal">
                <div className="password-modal-header">
                    <div className="password-modal-icon">
                        <FiLock />
                    </div>
                    <div>
                        <h3>Cambiar contraseña</h3>
                        <p>Por seguridad, debes actualizar tu contraseña provisoria.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="password-modal-body">
                    <div className="password-field">
                        <label>Contraseña actual</label>
                        <input
                            type="password"
                            value={oldPass}
                            onChange={(e) => setOldPass(e.target.value)}
                            className="form-control"
                            placeholder="Ingresa tu contraseña actual"
                        />
                    </div>

                    <div className="password-field">
                        <label>Nueva contraseña</label>
                        <input
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            className="form-control"
                            placeholder="Nueva contraseña segura"
                        />
                    </div>

                    <div className="password-field">
                        <label>Repetir nueva contraseña</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="form-control"
                            placeholder="Repite la nueva contraseña"
                        />
                    </div>

                    <p className="password-hint">
                        Debe tener al menos <strong>8 caracteres</strong>, con
                        <strong> mayúscula</strong>, <strong>minúscula</strong> y
                        <strong> símbolo</strong>.
                    </p>

                    {msg.text && (
                        <p
                            className={
                                msg.type === "error"
                                    ? "password-modal-message error"
                                    : "password-modal-message success"
                            }
                        >
                            {msg.text}
                        </p>
                    )}

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </form>
            </div>
        </div>
    );
};
