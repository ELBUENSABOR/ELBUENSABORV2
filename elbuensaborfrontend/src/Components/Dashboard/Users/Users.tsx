import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { getAllUsers, deleteUserService } from "../../../services/userService";
import type { UsuarioDTO } from "../../../dtos/UsuarioDTO";
import "./users.css";
import { useNavigate } from "react-router-dom";
import ModalConfirmAction from "../../ModalConfirmAction/ModalConfirmAction";
import Alert from "../../Alert/Alert";
import { Users } from 'lucide-react';

const Users = () => {
    const [originalUsers, setOriginalUsers] = useState<UsuarioDTO[]>();
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [activeTab, setActiveTab] = useState<"empleados" | "clientes">(
        "empleados"
    );

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await getAllUsers();
                console.log("res", res);
                const filtered = res.data.filter(
                    (u: { rolSistema: string }) => u.rolSistema !== "ADMIN"
                );
                setOriginalUsers(filtered);
            } catch (error) {
                console.error("Error al obtener los usuarios", error);
            }
        };
        getData();
    }, [refresh]);

    const handleEditUser = (id: number) => {
        navigate(`/dashboard/usuarios/edit/${id}`);
    };

    const handleDeleteUser = (id: number) => {
        setCurrentId(id);
        setShowModal(true);
    };

    const deleteUser = async (id: number) => {
        try {
            const res = await deleteUserService(id);
            console.log("res", res);
            if (res) {
                setRefresh(!refresh);
                setAlertMessage("Usuario eliminado con éxito!");
                setAlertStatus("success");
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Error", error);
            setAlertMessage("Error al eliminar el usuario");
            setAlertStatus("error");
        }
    };

    const filterData = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.target.value);
    };

    const handleStatusFilter = (e: ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const employeesCount =
        originalUsers?.filter((u) => u.rolSistema === "EMPLEADO").length ?? 0;
    const clientsCount =
        originalUsers?.filter((u) => u.rolSistema === "CLIENTE").length ?? 0;

    const filteredUsers = useMemo(() => {
        const list = originalUsers ?? [];
        const role = activeTab === "empleados" ? "EMPLEADO" : "CLIENTE";
        const normalizedFilter = filterValue.trim().toLowerCase();
        return list.filter((u) => {
            if (u.rolSistema !== role) {
                return false;
            }
            if (statusFilter !== "todos") {
                const isActive = u.activo === true;
                if (statusFilter === "activos" && !isActive) {
                    return false;
                }
                if (statusFilter === "inactivos" && isActive) {
                    return false;
                }
            }
            if (!normalizedFilter) {
                return true;
            }
            return (
                `${u.nombre} ${u.apellido}`.toLowerCase().includes(normalizedFilter) ||
                u.email.toLowerCase().includes(normalizedFilter)
            );
        });
    }, [activeTab, filterValue, originalUsers, statusFilter]);

    return (
        <div className="users-container">
            <div className="users-header">
                <div className="users-title">
          <span className="users-title-icon" aria-hidden="true">
            <Users />
          </span>
                    <div>
                        <h5>Usuarios</h5>
                        <p>Gestión de empleados y clientes</p>
                    </div>
                </div>
            </div>
            <div className="users-controls">
                <div className="users-search">
          <span className="users-search-icon" aria-hidden="true">
            🔍
          </span>
                    <input
                        name="search"
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="form-control"
                        value={filterValue}
                        onChange={(e) => filterData(e)}
                    />
                </div>
                <select
                    name="status"
                    className="form-select users-status"
                    value={statusFilter}
                    onChange={handleStatusFilter}
                >
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </select>
                <button
                    className="btn users-add-button"
                    onClick={() => navigate("/dashboard/usuarios/add")}
                >
                    + Nuevo
                </button>
            </div>
            <div className="users-tabs" role="tablist" aria-label="Tipos de usuarios">
                <button
                    type="button"
                    className={`users-tab ${activeTab === "empleados" ? "active" : ""}`}
                    onClick={() => setActiveTab("empleados")}
                >
                    Empleados ({employeesCount})
                </button>
                <button
                    type="button"
                    className={`users-tab ${activeTab === "clientes" ? "active" : ""}`}
                    onClick={() => setActiveTab("clientes")}
                >
                    Clientes ({clientsCount})
                </button>
            </div>
            <div className="users-table-card">
                <div className="users-table-header">
          <span className="users-table-icon" aria-hidden="true">
            📋
          </span>
                    <h6>
                        Lista de {activeTab === "empleados" ? "Empleados" : "Clientes"}
                    </h6>
                </div>
                <div className="table-container">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th>Fecha Registro</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="table-group-divider">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                                <tr className={u.activo ? "" : "deleted-row"} key={u.id}>
                                    <td>{`${u.nombre} ${u.apellido}`}</td>
                                    <td>{u.email}</td>
                                    <td>{u.telefono}</td>
                                    <td>
                      <span
                          className={`status-pill ${
                              u.activo ? "active" : "inactive"
                          }`}
                      >
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                                    </td>
                                    <td>-</td>
                                    <td>
                                        {u.activo && (
                                            <div className="users-actions">
                                                <button
                                                    onClick={() => handleEditUser(u.id)}
                                                    className="action-button edit"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="action-button delete"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="users-empty">
                                    No hay {activeTab === "empleados" ? "empleados" : "clientes"}{" "}
                                    registrados
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <ModalConfirmAction
                    show={showModal}
                    setShowModal={setShowModal}
                    headerText="¿Deseas eliminar el usuario?"
                    bodyText="Se eliminará el usuario y sus datos"
                    onClick={() => deleteUser(currentId)} // acción confirmada
                />
            )}
            {showAlert && (
                <Alert
                    message={alertMessage}
                    status={alertStatus as "success" | "error"}
                    onClose={() => setShowAlert(false)}
                />
            )}
        </div>
    );
};

export default Users;