import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getPedidoById } from "../../../services/pedidoService";
import type { PedidoResponse } from "../../../services/pedidoService";
import {
  pagarConMercadoPago,
  verificarPago,
} from "../../../services/pagoService";

const OrderDetails = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState<PedidoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (!id) return;

    const fetchPedido = () =>
      getPedidoById(Number(id))
        .then((res) => setPedido(res))
        .catch(() => setError("No se pudo cargar el pedido"))
        .finally(() => setLoading(false));

    const params = new URLSearchParams(location.search);

    const cameFromMp = params.get("mp") === "1";

    const paymentId = params.get("payment_id") || params.get("collection_id");

    const status = params.get("status") || params.get("collection_status");

    // Si venimos de MP, verificamos y recargamos pedido
    if (cameFromMp || (paymentId && status)) {
      verificarPago(Number(id), paymentId)
        .catch(() => console.error("Error verificando el pago"))
        .finally(fetchPedido);
      return;
    }

    fetchPedido();
  }, [id, location.search]);

  if (loading) return <p>Cargando pedido...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!pedido) return null;

  const handlePagar = async () => {
    try {
        const initPoint = await pagarConMercadoPago(pedido.id);
        window.location.href = initPoint;
    } catch (e) {
      console.error(e);
      alert("No se pudo iniciar el pago con Mercado Pago");
    }
  };

  const minutosEstimados = Math.max(
    0,
    Math.round(
      (new Date(pedido.horaEstimadaFinalizacion).getTime() - Date.now()) /
        60000,
    ),
  );

  return (
    <div className="container mt-4">
      <h3>Pedido {pedido.numero}</h3>
      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(pedido.fechaPedido).toLocaleString("es-AR")}
      </p>
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
        {pedido.tipoEnvio === "DELIVERY"
          ? "Envío a domicilio"
          : "Retiro en local"}
      </p>
      <p>
        <strong>Forma de pago:</strong>{" "}
        {pedido.formaPago === "MP" ? "Mercado Pago" : "Efectivo"}
      </p>
      {pedido.tipoEnvio === "DELIVERY" && (
        <>
          <p>
            <strong>Dirección:</strong> {pedido.direccionEntrega}
          </p>
          <p>
            <strong>Teléfono:</strong> {pedido.telefonoEntrega}
          </p>
        </>
      )}
      <p>
        <strong>Pago:</strong> {pedido.pagado ? "Aprobado" : "Pendiente"}
      </p>
      <hr />
      <h5>Detalle del pedido</h5>
      {pedido.detalles.map((det) => (
        <div
          key={det.id}
          className="d-flex justify-content-between border-bottom py-2"
        >
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
      {pedido.factura && (
        <div className="mt-3 p-3 border rounded">
          <h5>Factura</h5>
          <p>Número: {pedido.factura.numeroComprobante}</p>
          <p>Total: ${pedido.factura.totalVenta}</p>
          {pedido.factura.pdfUrl && (
            <a
              href={pedido.factura.pdfUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="btn btn-outline-success"
            >
              Ver factura (PDF)
            </a>
          )}
        </div>
      )}
      {pedido.formaPago === "MP" &&
        pedido.estado === "A_CONFIRMAR" &&
        !pedido.pagado &&
        !pedido.factura?.pdfUrl && (
          <button className="btn btn-primary w-100 mt-3" onClick={handlePagar}>
            Pagar con Mercado Pago
          </button>
        )}
    </div>
  );
};

export default OrderDetails;
