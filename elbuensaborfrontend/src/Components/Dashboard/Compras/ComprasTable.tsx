import { useEffect, useState } from "react";
import type { CompraInsumo } from "../../../models/CompraInsumo";
import { getAllComprasInsumos } from "../../../services/insumosService";
import { useNavigate } from "react-router-dom";

const ComprasTable = () => {
    const navigate = useNavigate();
    const [compras, setCompras] = useState<CompraInsumo[]>([]);

    useEffect(() => {
        const getData = async () => {
            const data = await getAllComprasInsumos();
            console.log(data);
            const sorted = data.sort((a: { fechaCompra: string | number | Date; }, b: { fechaCompra: string | number | Date; }) => new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime());
            setCompras(sorted);
        }
        getData();
    }, []);


    return (
        <div>
            <h2>Compras</h2>
            <hr />
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/dashboard/compras')}>Volver</button>
            {
                compras.length === 0 && (
                    <p>No hay compras realizadas.</p>
                )
            }
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Fecha</th>
                        <th>Sucursal</th>
                        <th>Insumo</th>
                        <th>Precio compra</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {compras.map((compra) => (
                        <tr key={compra.id}>
                            <td>{compra.id}</td>
                            <td>{new Date(compra.fechaCompra).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</td>
                            <td>{compra.sucursal.nombre}</td>
                            <td>{compra.insumo.denominacion}</td>
                            <td>${compra.precioCompra}</td>
                            <td>{compra.cantidad} {compra.insumo.unidadMedida.denominacion}</td>
                            <td>${compra.totalCompra}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComprasTable;