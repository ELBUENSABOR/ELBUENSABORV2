import {Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle} from "react-bootstrap";
import {
    createUnidadMedida,
    deleteUnidadMedida,
    editUnidadMedida,
    getAllUnidadesMedida
} from "../../../../services/insumosService";
import {useEffect, useState} from "react";
import type {UnidadMedida} from "../../../../models/UnidadMedida";

const UnidadMedidaModal = ({showModal, setShowModal}: {
    showModal: boolean,
    setShowModal: (show: boolean) => void
}) => {
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [createNewUnidad, setCreateNewUnidad] = useState(false);
    const [newUnidad, setNewUnidad] = useState({
        denominacion: "",
        activo: true,
    });
    const [editUnidad, setEditUnidad] = useState(false);
    const [editUnidadId, setEditUnidadId] = useState<number | undefined>(undefined);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const load = async () => {
            const unidades = await getAllUnidadesMedida();
            const actives = unidades.filter((u: { activo: any; }) => !u.activo);
            setUnidadesMedida(actives);
        };
        load();
    }, [refresh, showModal]);

    const handleSubmit = async () => {
        const unidad = await createUnidadMedida(newUnidad);
        console.log(unidad);
        setUnidadesMedida([...unidadesMedida, unidad]);
        setCreateNewUnidad(false);
        setNewUnidad({
            denominacion: "",
            activo: true,
        });
        setRefresh(!refresh);
    };

    const handleEdit = (id: number | undefined) => {
        setEditUnidad(true);
        const unidad = unidadesMedida.find((u) => u.id === id);
        setNewUnidad(unidad as UnidadMedida);
        setEditUnidadId(id);
    };

    const handleEditSubmit = async () => {
        const unidad = await editUnidadMedida(editUnidadId, newUnidad);
        console.log(unidad);
        const unidadIndex = unidadesMedida.findIndex((u) => u.id === editUnidadId);
        unidadesMedida[unidadIndex] = unidad;
        setUnidadesMedida(unidadesMedida);
        setEditUnidad(false);
        setEditUnidadId(undefined);
        setNewUnidad({
            denominacion: "",
            activo: true,
        });
        setRefresh(!refresh);
    };

    const handleDelete = async (id: number | undefined) => {
        const unidad = await deleteUnidadMedida(id);
        console.log(unidad);
        const unidadIndex = unidadesMedida.findIndex((u) => u.id === id);
        unidadesMedida.splice(unidadIndex, 1);
        setUnidadesMedida(unidadesMedida);
        setRefresh(!refresh);
    };

    return (
        <Modal show={showModal} onHide={() => {
            setShowModal(false);
            setCreateNewUnidad(false);
        }} size="lg">
            <ModalHeader closeButton>
                <ModalTitle>Unidades de Medida</ModalTitle>
            </ModalHeader>
            <ModalBody>
                {
                    createNewUnidad ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                            setCreateNewUnidad(false)
                        }}>
                            <p>Crear nueva unidad de medida</p>
                            <input type="text" placeholder="Denominación" className="form-control mb-3"
                                   value={newUnidad.denominacion}
                                   onChange={(e) => setNewUnidad({...newUnidad, denominacion: e.target.value})}
                                   required/>
                            <button className="btn btn-primary" type="submit">Guardar</button>
                        </form>
                    ) : editUnidad ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleEditSubmit();
                            setEditUnidad(false)
                        }}>
                            <p>Editar unidad de medida</p>
                            <input type="text" placeholder="Denominación" className="form-control mb-3"
                                   value={newUnidad.denominacion}
                                   onChange={(e) => setNewUnidad({...newUnidad, denominacion: e.target.value})}
                                   required/>
                            <button className="btn btn-primary" type="submit">Guardar</button>
                        </form>) : (
                        <div>
                            <p>Lista de unidades de medida:</p>
                            {
                                unidadesMedida.map((u) => (
                                    <div key={u.id}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="mb-0">- {u.denominacion}</p>
                                            <div>
                                                <button className="btn btn-primary btn-sm"
                                                        onClick={() => handleEdit(u.id)}>Editar
                                                </button>
                                                <button className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(u.id)}>Eliminar
                                                </button>
                                            </div>
                                        </div>
                                        <hr/>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-primary" onClick={() => {
                    setCreateNewUnidad(true);
                    setNewUnidad({denominacion: "", activo: true});
                }}>+ Nueva
                </button>
            </ModalFooter>
        </Modal>
    );
};

export default UnidadMedidaModal;