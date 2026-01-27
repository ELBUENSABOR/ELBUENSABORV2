import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPedidoById } from "../../../services/pedidoService";
import type { PedidoResponse } from "../../../services/pedidoService";
import { pagarConMercadoPago } from "../../../services/pagoService";

const OrderDetails = () => {
    const { id } = useParams();
    const [pedido, setPedido] = useState<PedidoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        getPedidoById(Number(id))
            .then(res => { console.log(res); setPedido(res) })
            .catch(() => setError("No se pudo cargar el pedido"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Cargando pedido...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!pedido) return null;

    const handlePagar = async () => {
        const res = await pagarConMercadoPago(pedido.id);
        console.log(res);
        window.location.href = res.data.initPoint;
    };

    const minutosEstimados = Math.max(
        0,
        Math.round(
            (new Date(pedido.horaEstimadaFinalizacion).getTime() - Date.now()) / 60000
        )
    );

    return (
        <div className="container mt-4">
            <h3>Pedido {pedido.numero}</h3>
            <p>
                <strong>Estado:</strong> {pedido.estado}
            </p>
            <p>
                ⏱ Tiempo estimado: <strong>{minutosEstimados} minutos</strong>
            </p>
            <hr />
            <p>
                <strong>Sucursal:</strong> {pedido.sucursal.nombre}
            </p>
            <p>
                <strong>Entrega:</strong>{" "}
                {pedido.tipoEnvio === "DELIVERY" ? "Envío a domicilio" : "Retiro en local"}
            </p>
            <p>
                <strong>Forma de pago:</strong>{" "}
                {pedido.formaPago === "MP" ? "Mercado Pago" : "Efectivo"}
            </p>
            <hr />
            <h5>Detalle del pedido</h5>
            {pedido.detalles.map(det => (
                <div key={det.id} className="d-flex justify-content-between border-bottom py-2">
                    <div>
                        {det.articulo.denominacion} x {det.cantidad}
                    </div>
                    <div>${det.subTotal}</div>
                </div>
            ))}
            <hr />
            <div className="text-end">
                <p>Subtotal: ${pedido.subTotal}</p>
                {pedido.descuento > 0 && <p>Descuento: -${pedido.descuento}</p>}
                {pedido.gastosEnvio > 0 && <p>Envío: ${pedido.gastosEnvio}</p>}
                <h5>Total: ${pedido.total}</h5>
            </div>
            {pedido.formaPago === "MP" &&
                pedido.estado === "A_CONFIRMAR" &&
                !pedido.pagado && (
                    <button
                        className="btn btn-primary w-100 mt-3"
                        onClick={handlePagar}
                    >
                        Pagar con Mercado Pago
                    </button>
                )}
        </div>
    );
};

export default OrderDetails;
