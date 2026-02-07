import {useEffect, useState, type ChangeEvent, type JSX} from "react";
import "./rubros.css";
import {useNavigate} from "react-router-dom";
import ModalConfirmAction from "../../ModalConfirmAction/ModalConfirmAction";
import Alert from "../../Alert/Alert";
import type {Rubro} from "../../../models/Rubro";
import {getRubrosInsumos, deleteRubroInsumoService} from "../../../services/rubrosService";

interface RubroWithChildren extends Rubro {
    children?: RubroWithChildren[];
}

const RubrosInsumos = () => {
    const [rubrosTree, setRubrosTree] = useState<RubroWithChildren[]>([]);
    const [originalRubros, setOriginalRubros] = useState<Rubro[]>([]);
    const navigate = useNavigate();

    const [currentId, setCurrentId] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState<"success" | "error">(
        "success"
    );

    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | "activo" | "inactivo">("activo");
    const buildTree = (rubros: Rubro[]): RubroWithChildren[] => {
        const map = new Map<number, RubroWithChildren>();
        const roots: RubroWithChildren[] = [];

        rubros.forEach((r) => {
            map.set(r.id, {...r, children: []});
        });

        rubros.forEach((r) => {
            if (!r.categoriaPadreId) {
                roots.push(map.get(r.id)!);
            } else {
                const parent = map.get(r.categoriaPadreId);
                if (parent && parent.children) parent.children.push(map.get(r.id)!);
            }
        });

        return roots;
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await getRubrosInsumos();
                setOriginalRubros(res);

                const tree = buildTree(res);
                setRubrosTree(tree);
                console.log("tree", tree);
            } catch (error) {
                console.error("Error al obtener rubros", error);
            }
        };

        getData();
    }, [refresh]);

    const renderRows = (nodes: RubroWithChildren[], level = 0): JSX.Element[] => {
        return nodes.flatMap((node) => [
            <tr key={node.id}>
                <td>{node.id}</td>

                <td style={{paddingLeft: `${level * 20}px`}}>
                    {level > 0 && "— "}
                    {node.denominacion}
                </td>

                <td>
                    <span className={`badge ${node.activo ? "bg-success" : "bg-secondary"}`}>
                        {node.activo ? "Activo" : "Inactivo"}
                    </span>
                </td>

                <td>
                    <button
                        onClick={() =>
                            navigate(`/dashboard/insumos/rubros/edit/${node.id}`)
                        }
                        className="btn btn-primary btn-sm me-2"
                    >
                        Editar
                    </button>

                    <button
                        onClick={() => navigate(`/dashboard/insumos/rubros/${node.id}/add`)}
                        className="btn btn-secondary btn-sm me-2"
                    >
                        + Subrubro
                    </button>

                    <button
                        onClick={() => {
                            setCurrentId(node.id);
                            setShowModal(true);
                        }}
                        className="btn btn-danger btn-sm"
                    >
                        Eliminar
                    </button>
                </td>
            </tr>,

            ...renderRows(node.children || [], level + 1),
        ]);
    };

    const filterTree = (
        nodes: Rubro[],
        text: string,
        status: "todos" | "activo" | "inactivo"
    ): RubroWithChildren[] => {
        const search = text.trim().toLowerCase();


        const recursiveFilter = (node: Rubro): RubroWithChildren | null => {

            const matchesSearch = !search || node.denominacion.toLowerCase().includes(search);
            const matchesStatus =
                status === "todos" ? true : status === "activo" ? node.activo : !node.activo;

            const children = originalRubros
                .filter((r) => r.categoriaPadreId === node.id)
                .map(recursiveFilter)
                .filter((child): child is RubroWithChildren => child !== null);

            if ((matchesSearch && matchesStatus) || children.length > 0) {
                return {...node, children};
            }

            return null;
        };

        const roots = originalRubros.filter(
            (r) => !r.categoriaPadreId || r.categoriaPadreId === 0
        );

        return roots.map(recursiveFilter).filter((child): child is RubroWithChildren => child !== null);
    };

    useEffect(() => {
        if (!filterValue.trim() && statusFilter === "todos") {
            setRubrosTree(buildTree(originalRubros));
            return;
        }

        const filteredTree = filterTree(originalRubros, filterValue, statusFilter);
        setRubrosTree(filteredTree);
    }, [filterValue, statusFilter, originalRubros]);

    const filterData = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.target.value);

    };

    const deleteRubro = async (id: number) => {
        try {
            const res = await deleteRubroInsumoService(id);
            if (res) {
                setRefresh(!refresh);
                setAlertMessage("Rubro eliminado con éxito!");
                setAlertStatus("success");
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Error", error);
            setAlertMessage("Error al eliminar el rubro");
            setAlertStatus("error");
            setShowAlert(true);
        }
    };

    return (
        <div className="users-container">
            <h5>Rubros de Insumos</h5>
            <hr/>

            <div className="header-dashboard">
                <input
                    name="search"
                    type="text"
                    placeholder="Buscar rubros..."
                    className="form-control"
                    value={filterValue}
                    onChange={filterData}
                />

                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value as "todos" | "activo" | "inactivo")
                    }
                >
                    <option value="todos">Todos</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>

                <button
                    className="btn btn-success"
                    onClick={() => navigate("/dashboard/insumos/rubros/add")}
                >
                    + Nuevo Rubro
                </button>
            </div>

            <div className="dashboard-table-card">
                <div className="dashboard-table-header">Lista de Rubros</div>
                <div className="table-responsive">
                    <table className="table table-hover dashboard-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Denominación</th>
                            <th>Estado</th>
                            <th style={{width: "280px"}}>Acciones</th>
                        </tr>
                        </thead>

                        <tbody className="table-group-divider">
                        {renderRows(rubrosTree)}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <ModalConfirmAction
                    show={showModal}
                    setShowModal={setShowModal}
                    headerText="¿Deseas eliminar este rubro?"
                    bodyText="Esta acción no se puede deshacer"
                    onClick={() => deleteRubro(currentId)}
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

export default RubrosInsumos;