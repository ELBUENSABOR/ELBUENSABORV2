import {useEffect, useState, type ChangeEvent} from 'react'
import {useUser} from '../../../contexts/UsuarioContext';
import {useSucursal} from '../../../contexts/SucursalContext';
import {useNavigate} from 'react-router-dom';
import type {InsumoResponse} from '../../../models/Insumo';
import {getAll, deleteInsumo, reactivateInsumo} from '../../../services/insumosService';
import UnidadMedidaModal from './UnidadesMedidaModal/UnidadMedidaModal';
import {getRubrosInsumos} from '../../../services/rubrosService';
import type {Rubro} from '../../../models/Rubro';
import ModalConfirmAction from '../../Common/ModalConfirmAction/ModalConfirmAction';
import {getImageUrl} from '../../../utils/image';
import Alert from '../../Alert/Alert';

const ProductosInsumos = () => {
    const {sucursales, sucursalId, setSucursalId, loading} = useSucursal();
    const {user} = useUser();
    const [insumos, setInsumos] = useState<InsumoResponse[]>();
    const [rubros, setRubros] = useState<Rubro[]>();
    const [originalInsumos, setOriginalInsumos] =
        useState<InsumoResponse[]>();

    const [filterStatusValue, setFilterStatusValue] = useState("activo");
    const [filterValue, setFilterValue] = useState("");
    const [filterRubroValue, setFilterRubroValue] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [showModalUnidadMedida, setShowModalUnidadMedida] = useState(false);

    const [currentId, setCurrentId] = useState(0);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState<"success" | "error">("success");

    const canManageProducts = user?.role === "ADMIN" || user?.subRole === "COCINERO";
    const navigate = useNavigate();

    const handleSucursalChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSucursalId(value ? Number(value) : null);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getAll();
                const categorias = await getRubrosInsumos();
                setRubros(categorias);
                console.log(response);
                if (response) {
                    setOriginalInsumos(response);
                }
            } catch (error) {
                console.error("Error al obtener insumos: ", error);
            }
        };

        getData();
    }, []);

    useEffect(() => {
        if (!originalInsumos) return;

        let filtered = [...originalInsumos];

        if (filterValue.trim() !== "") {
            const search = filterValue.toLowerCase();
            filtered = filtered.filter(
                (u) =>
                    u.denominacion.toLowerCase().includes(search) ||
                    u.categoria.denominacion.toLowerCase().includes(search)
            );
        }

        if (filterRubroValue !== null) {
            filtered = filtered.filter((u) => u.categoria.id === Number(filterRubroValue));
        }
        if (filterStatusValue !== "") {
            filtered = filtered.filter(
                (u) => filterStatusValue === "activo" ? u.activo : !u.activo
            );
        }

        setInsumos(filtered);
    }, [filterValue, filterRubroValue, filterStatusValue, originalInsumos]);

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

    const handleDeleteInsumo = (id: number) => {
        setCurrentId(id);
        setShowModal(true);
    };

    const deleteInsumoConfirm = async () => {
        try {
            await deleteInsumo(currentId);
            setShowModal(false);
            setAlertMessage("Insumo eliminado con éxito!");
            setAlertStatus("success");
            setShowAlert(true);
            setInsumos((prev) => prev?.map((i) => (i.id === currentId ? {...i, activo: false} : i)));
            setOriginalInsumos((prev) => prev?.map((i) => (i.id === currentId ? {...i, activo: false} : i)));
        } catch (error) {
            console.error("Error al eliminar insumo", error);
            setShowModal(false);
            setAlertMessage("Error al eliminar el insumo");
            setAlertStatus("error");
            setShowAlert(true);
        }
    };

    const reactivateInsumoConfirm = async (id: number) => {
        try {
            await reactivateInsumo(id);
            setInsumos((prev) => prev?.map((i) => (i.id === id ? {...i, activo: true} : i)));
            setOriginalInsumos((prev) => prev?.map((i) => (i.id === id ? {...i, activo: true} : i)));
            setAlertMessage("Insumo reactivado con éxito!");
            setAlertStatus("success");
            setShowAlert(true);
        } catch (error) {
            console.error("Error al reactivar insumo", error);
            setAlertMessage("Error al reactivar el insumo");
            setAlertStatus("error");
            setShowAlert(true);
        }
    };

    const getImagenUrl = (imagenes: InsumoResponse["imagenes"]) => {
        const primera = imagenes?.[0];
        if (!primera) return "";
        const rawPath = typeof primera === "string" ? primera : primera.url;
        return getImageUrl(rawPath);
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
                        placeholder="Buscar insumos..."
                        className="form-control"
                        value={filterValue}
                        onChange={filterData}
                    />

                    <select
                        name="status"
                        className="form-select"
                        value={filterStatusValue}
                        onChange={(e) => filterStatus(e)}
                    >
                        <option value="">Todos</option>
                        <option value="activo">Activos</option>
                        <option value="no-activo">No activos</option>
                    </select>

                    <select
                        name="categoria"
                        className="form-select"
                        value={filterRubroValue ?? ""}
                        onChange={(e) => filterRubro(e)}
                    >
                        <option value="">Todas las categorías</option>
                        {rubros?.map((rubro) => (
                            <option key={rubro.id} value={rubro.id}>
                                {rubro.denominacion}
                            </option>
                        ))}
                    </select>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModalUnidadMedida(true)}
                    >
                        Unidades
                    </button>

                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/dashboard/insumos/add")}
                    >
                        + Nuevo Insumo
                    </button>
                </div>
                <div className="dashboard-table-card">
                    <div className="dashboard-table-header">Lista de Insumos</div>
                    <div className="table-responsive">
                        <table className="table table-hover dashboard-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Imagen</th>
                                <th>Denominación</th>
                                <th>Precio de costo</th>
                                <th>Precio de venta</th>
                                <th>Categoría</th>
                                <th>Stock actual</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="table-group-divider">
                            {insumos?.map((m, index) => (
                                <tr key={index} className={m.activo ? "" : "deleted-row"}>
                                    <td>{m.id}</td>
                                    <td>
                                        {getImagenUrl(m.imagenes) ? (
                                            <img
                                                src={getImagenUrl(m.imagenes)}
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
                                    <td>${m.precioCompra}</td>
                                    <td>${m.precioVenta}</td>
                                    <td>{m.categoria.denominacion}</td>
                                    <td>
                                        {m.stockSucursal.find((s) => s.sucursalId === sucursalId)
                                            ?.stockActual ?? 0} {m.unidadMedida.denominacion}
                                    </td>
                                    <td>
                                        {canManageProducts && (
                                            m.activo ? (
                                                <>
                                                    <button className="btn btn-primary"
                                                            onClick={() => navigate(`/dashboard/insumos/edit/${m.id}`)}>Editar
                                                    </button>
                                                    <button className="btn btn-danger"
                                                            onClick={() => handleDeleteInsumo(m.id ?? 0)}>Eliminar
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="btn btn-success"
                                                        onClick={() => reactivateInsumoConfirm(m.id ?? 0)}>Reactivar
                                                </button>
                                            )
                                        )}
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <UnidadMedidaModal showModal={showModalUnidadMedida}
                               setShowModal={setShowModalUnidadMedida}/>
            {showModal && (
                <ModalConfirmAction
                    show={showModal}
                    setShowModal={setShowModal}
                    headerText="¿Deseas eliminar el insumo?"
                    bodyText="Se dara de baja el insumo y sus datos"
                    onClick={() => deleteInsumoConfirm()}
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
}

export default ProductosInsumos