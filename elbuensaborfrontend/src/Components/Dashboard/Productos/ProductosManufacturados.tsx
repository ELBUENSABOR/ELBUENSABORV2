import { useEffect, useState, type ChangeEvent } from "react";
import { useSucursal } from "../../../contexts/SucursalContext";
import { useUser } from "../../../contexts/UsuarioContext";
import { getAll, deleteManufacturado } from "../../../services/manufacturadosService";
import type { Manufacturado } from "../../../models/Manufacturado";
import { useNavigate } from "react-router-dom";
import { getRubrosManufacturados } from "../../../services/rubrosService";
import type { Rubro } from "../../../models/Rubro";
import ModalConfirmAction from "../../Common/ModalConfirmAction/ModalConfirmAction";
import { getImageUrl } from '../../../utils/image';
import Alert from "../../Alert/Alert";

const ProductosManufacturados = () => {
    const { sucursales, sucursalId, setSucursalId, loading } = useSucursal();
    const { user } = useUser();
    const [rubros, setRubros] = useState<Rubro[]>();
    const [manufacturados, setManufacturados] = useState<Manufacturado[]>();
    const [originalManufacturados, setOriginalManufacturados] =
        useState<Manufacturado[]>();

    const [filterValue, setFilterValue] = useState("");
    const [filterStatusValue, setFilterStatusValue] = useState("activo");
    const [filterRubroValue, setFilterRubroValue] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const [currentId, setCurrentId] = useState(0);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState<"success" | "error">("success");

    const handleSucursalChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSucursalId(value ? Number(value) : null);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getAll(sucursalId ?? 0);
                const rubros = await getRubrosManufacturados();
                setRubros(rubros.data);
                console.log(response);
                if (response) {
                    setManufacturados(response);
                    setOriginalManufacturados(response);
                }
            } catch (error) {
                console.error("Error al obtener manufacturados: ", error);
            }
        };

        getData();
    }, [sucursalId]);

    useEffect(() => {
        if (!originalManufacturados) return;

        let filtered = [...originalManufacturados];

        if (filterValue.trim() !== "") {
            const search = filterValue.toLowerCase();
            filtered = filtered.filter(
                (u) =>
                    u.denominacion.toLowerCase().includes(search) ||
                    u.categoria?.toLowerCase().includes(search)
            );
        }

        if (filterRubroValue !== null) {
            filtered = filtered.filter((u) => u.categoriaId === Number(filterRubroValue));
        }
        if (filterStatusValue !== "") {
            filtered = filtered.filter(
                (u) => filterStatusValue === "activo" ? u.activo : !u.activo
            );
        }

        setManufacturados(filtered);
    }, [filterValue, filterRubroValue, filterStatusValue, originalManufacturados]);

    const filterData = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.target.value);
    };

    const filterRubro = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFilterRubroValue(value ? Number(value) : null);
    };

    const filterStatus = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilterStatusValue(e.target.value);
    };

    const handleDeleteManufacturado = (id: number) => {
        setCurrentId(id);
        setShowModal(true);
    };

    const deleteManufacturadoConfirm = async () => {
        try {
            await deleteManufacturado(currentId);
            setManufacturados((prev) =>
                prev?.map((m) => (m.id === currentId ? { ...m, activo: false } : m))
            );
            setOriginalManufacturados((prev) =>
                prev?.map((m) => (m.id === currentId ? { ...m, activo: false } : m))
            );
            setShowModal(false);
            setAlertMessage("Manufacturado eliminado con éxito!");
            setAlertStatus("success");
            setShowAlert(true);
        } catch (error) {
            console.error("Error al eliminar manufacturado", error);
            setShowModal(false);
            setAlertMessage("Error al eliminar el manufacturado");
            setAlertStatus("error");
            setShowAlert(true);
        }
    };

    const getManufacturadoImageUrl = (imagenes: Manufacturado["imagenes"]) => {
        const primera = imagenes?.[0];
        if (!primera) return "";
        return getImageUrl(primera);
    };

    return (
        <div>
            <div>
                <div>
                    {user?.role === "ADMIN" && (
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                            <div className="d-flex align-items-center gap-2">
                                <label className="mb-0 text-muted" htmlFor="sucursal-select">
                                    Sucursal:
                                </label>
                                <select
                                    id="sucursal-select"
                                    className="form-select form-select-sm w-auto"
                                    value={sucursalId ?? ""}
                                    onChange={handleSucursalChange}
                                    disabled={loading || sucursales.length === 0}
                                >
                                    <option value="">Seleccione</option>
                                    {sucursales.map((sucursal) => (
                                        <option key={sucursal.id} value={sucursal.id}>
                                            {sucursal.nombre}
                                        </option>
                                    ))}
                                </select>
                                {loading && (
                                    <span className="text-muted small">cargando...</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="header-dashboard">
                    <input
                        name="search"
                        type="text"
                        placeholder="Buscar manufacturados..."
                        className="form-control"
                        value={filterValue}
                        onChange={filterData}
                    />

                    <select
                        name="status"
                        className="form-select"
                        value={filterStatusValue}
                        onChange={filterStatus}
                    >
                        <option value="">Todos</option>
                        <option value="activo">Activos</option>
                        <option value="no-activo">No activos</option>
                    </select>

                    <select
                        name="rubro"
                        className="form-select"
                        value={filterRubroValue ?? ""}
                        onChange={filterRubro}
                    >
                        <option value="">Todas las categorias</option>
                        {
                            rubros?.map((rubro) => (
                                <option key={rubro.id} value={rubro.id}>
                                    {rubro.denominacion}
                                </option>
                            ))
                        }
                    </select>

                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/dashboard/manufacturados/add")}
                    >
                        + Nuevo Manufacturado
                    </button>
                </div>
                <table className="table table-hover">
                    <thead>
                    <th>#</th>
                    <th>Imagen</th>
                    <th>Denominación</th>
                    <th>Precio de costo</th>
                    <th>Precio de venta</th>
                    <th>Categoría</th>
                    <th>Tiempo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                    </thead>
                    <tbody className="table-group-divider">
                    {manufacturados?.map((m, index) => (
                        <tr key={index} className={m.activo ? "" : "deleted-row"}>
                            <td>{m.id}</td>
                            <td>
                                {getManufacturadoImageUrl(m.imagenes) ? (
                                    <img
                                        src={getManufacturadoImageUrl(m.imagenes)}
                                        alt={m.denominacion}
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            objectFit: "cover",
                                            borderRadius: "6px",
                                        }}
                                    />
                                ) : (
                                    <span className="text-muted small">Sin imagen</span>
                                )}
                            </td>
                            <td>{m.denominacion}</td>
                            <td>${m.precioCosto}</td>
                            <td>${m.precioVenta}</td>
                            <td>{m.categoria}</td>
                            <td>{m.tiempoEstimado} min</td>
                            <td>
                                <span className={`badge ${m.activo ? "text-bg-success" : "text-bg-secondary"}`}>
                                    {m.activo ? "Alta" : "Baja"}
                                </span>
                            </td>
                            <td>
                                {
                                    m.activo && (
                                        <>
                                            <button className="btn btn-primary" onClick={() => navigate(`/dashboard/manufacturados/edit/${m.id}`)}>Editar</button>
                                            <button className="btn btn-danger" onClick={() => handleDeleteManufacturado(m.id)}>Eliminar</button>
                                        </>
                                    )
                                }
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
                    headerText="¿Deseas eliminar el manufacturado?"
                    bodyText="Se dara de baja el manufacturado y sus datos"
                    onClick={() => deleteManufacturadoConfirm()}
                />
            )}
            {showAlert && (
                <Alert
                    message={alertMessage}
                    status={alertStatus}
                    onClose={() => setShowAlert(false)}
                />
            )}
        </div>
    );
};

export default ProductosManufacturados;