import {useEffect, useMemo, useState, type ChangeEvent} from "react";
import {getAllUsers, deleteUserService, reactivateUserService} from "../../../services/userService";
import type {UsuarioDTO} from "../../../dtos/UsuarioDTO";
import "./users.css";
import {useNavigate} from "react-router-dom";
import ModalConfirmAction from "../../Common/ModalConfirmAction/ModalConfirmAction";
import Alert from "../../Alert/Alert";
import {ClipboardList} from "lucide-react";

const formatRegistrationDate = (fechaRegistro?: string) => {
    if (!fechaRegistro) {
        return "-";
    }

    const parsedDate = new Date(fechaRegistro);
    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
    });
};

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
    const [statusFilter, setStatusFilter] = useState("activos");
    const [activeTab, setActiveTab] = useState<"empleados" | "clientes">(
        "empleados"
    );

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await getAllUsers();
                console.log("res", res);
                setOriginalUsers(res.data);
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

    const reactivateUser = async (id: number) => {
        try {
            const res = await reactivateUserService(id);
            console.log("res", res);
            if (res) {
                setRefresh(!refresh);
                setAlertMessage("Usuario reactivado con éxito!");
                setAlertStatus("success");
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Error", error);
            setAlertMessage("Error al reactivar el usuario");
            setAlertStatus("error");
            setShowAlert(true);
        }
    };

    const filterData = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.target.value);
    };

    const handleStatusFilter = (e: ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const employeesCount =
        originalUsers?.filter(
            (u) => u.rolSistema === "EMPLEADO" || u.rolSistema === "ADMIN"
        ).length ?? 0;
    const clientsCount =
        originalUsers?.filter((u) => u.rolSistema === "CLIENTE").length ?? 0;

    const filteredUsers = useMemo(() => {
        const list = originalUsers ?? [];
        const normalizedFilter = filterValue.trim().toLowerCase();
        return list.filter((u) => {
            const isEmployeeTabUser =
                u.rolSistema === "EMPLEADO" || u.rolSistema === "ADMIN";

            if (activeTab === "empleados" && !isEmployeeTabUser) {
                return false;
            }

            if (activeTab === "clientes" && u.rolSistema !== "CLIENTE") {
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
            <div className="users-controls">
                <div className="users-search">
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
                <ClipboardList/>
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
                                    <td>{formatRegistrationDate(u.fechaRegistro)}</td>
                                    <td>
                                        <div className="users-actions">
                                            {u.activo ? (
                                                <>
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
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => reactivateUser(u.id)}
                                                    className="action-button edit"
                                                >
                                                    Reactivar
                                                </button>
                                            )}
                                        </div>
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