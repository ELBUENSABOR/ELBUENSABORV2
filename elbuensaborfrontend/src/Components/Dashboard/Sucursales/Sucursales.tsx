import {type ChangeEvent, useEffect, useState} from "react";
import {fetchSucursales} from "../../../services/dashboardService";
import {useNavigate} from "react-router-dom";
import type {Sucursal} from "../../../models/Sucursal";
import "./sucursales.css";

const Sucursales = () => {
    const [sucursales, setSucursales] = useState<Sucursal[]>();
    const [originalSucursales, setOriginalSucursales] = useState<Sucursal[]>();
    const [filterValue, setFilterValue] = useState("");
    const [filterStatus, setFilterStatus] = useState("activo");
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetchSucursales();
                console.log("res", res);
                setSucursales(res);
                setOriginalSucursales(res);
            } catch (error) {
                console.error("Error al obtener sucursales", error);
            }
        };

        getData();
    }, []);

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
            setSucursales(originalSucursales);
            return;
        }

        if (originalSucursales) {
            const filtered = originalSucursales.filter((u) =>
                u.nombre.toLowerCase().includes(text)
            );

            setSucursales(filtered);
        }
    };

    const handleEditSucursal = (id: number) => {
        navigate(`/dashboard/sucursales/add/${id}`);
    };

    return (
        <div className="sucursales-container">
            <h5>Sucursales</h5>
            <hr/>
            <div className="header-dashboard">
                <input
                    name="search"
                    type="text"
                    placeholder="Buscar sucursales..."
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
                    onClick={() => navigate("/dashboard/sucursales/add")}
                >
                    + Nueva
                </button>
            </div>
            <div className="dashboard-table-card">
                <div className="dashboard-table-header">Lista de Sucursales</div>
                <div className="table-responsive">
                    <table className="table table-hover dashboard-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Horario apertura</th>
                            <th>Horario cierre</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="table-group-divider">
                        {sucursales?.map((s, index) => (
                            <tr key={index}>
                                <td>{s.id}</td>
                                <td>{s.nombre}</td>
                                <td>{s.horarioApertura}</td>
                                <td>{s.horarioCierre}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            const id = s.id;
                                            if (id != null) handleEditSucursal(id);
                                        }}
                                        className="btn btn-primary"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Sucursales;