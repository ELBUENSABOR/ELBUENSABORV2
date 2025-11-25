import React, { useEffect, useState, type ChangeEvent } from "react";
import { getAllUsers, deleteUserService } from "../../../services/userService";
import type { UsuarioDTO } from "../../../dtos/UsuarioDTO";
import "./users.css";
import { useNavigate } from "react-router-dom";
import ModalConfirmAction from "../../ModalConfirmAction/ModalConfirmAction";
import Alert from "../../Alert/Alert";

const Users = () => {
  const [users, setUsers] = useState<UsuarioDTO[]>();
  const [originalUsers, setOriginalUsers] = useState<UsuarioDTO[]>();
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterStatus, setFilterStatus] = useState("activo");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllUsers();
        console.log("res", res);
        const filtered = res.data.filter(
          (u: { rolSistema: string }) => u.rolSistema !== "ADMIN"
        );
        const activeUsers = filtered.filter(
          (u: { activo: boolean }) => u.activo === true
        );
        setUsers(activeUsers);
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

  const filterData = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const text = e.target.value.toLowerCase();
    if (e.target.name === "status") {
      setFilterStatus(text);
    } else {
      setFilterValue(text);
    }

    if (text.trim() === "") {
      setUsers(originalUsers);
      return;
    }

    if (originalUsers) {
      let filtered;
      if (e.target.name === "status") {
        filtered = originalUsers.filter((u) =>
          e.target.value === "activo" ? u.activo === true : u.activo === false
        );
      } else {
        filtered = originalUsers.filter(
          (u) =>
            u.username.toLowerCase().includes(text) ||
            u.email.toLowerCase().includes(text) ||
            u.rolSistema.toLowerCase().includes(text) ||
            u.nombre.toLowerCase().includes(text) ||
            u.apellido.toLowerCase().includes(text) ||
            u.telefono.toLowerCase().includes(text)
        );
      }
      setUsers(filtered);
    }
  };

  return (
    <div className="users-container">
      <h5>Usuarios</h5>
      <hr />
      <div className="header-dashboard">
        <input
          name="search"
          type="text"
          placeholder="Buscar usuarios..."
          className="form-control"
          value={filterValue}
          onChange={(e) => filterData(e)}
        />
        <select
          name="status"
          className="form-select"
          value={filterStatus}
          onChange={(e) => filterData(e)}
        >
          <option value="">Todos</option>
          <option value="activo">Activos</option>
          <option value="no-activo">No activos</option>
        </select>
        <button
          className="btn btn-success"
          onClick={() => navigate("/dashboard/usuarios/add")}
        >
          + Nuevo
        </button>
      </div>
      <div className="table-container">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Nombre de usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {users?.map((u, index) => (
              <tr className={u.activo ? "" : "deleted-row"} key={index}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.telefono}</td>
                <td>{u.rolSistema}</td>
                <td>
                  {u.activo && (
                    <>
                      <button
                        onClick={() => handleEditUser(u.id)}
                        className="btn btn-primary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="btn btn-danger"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
