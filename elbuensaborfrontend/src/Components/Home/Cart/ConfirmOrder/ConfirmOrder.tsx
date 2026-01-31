import { useEffect, useState } from "react";
import { useCart } from "../../../../contexts/CartContext";
import { useUser } from "../../../../contexts/UsuarioContext";
import { useSucursal } from "../../../../contexts/SucursalContext";
import { useNavigate } from "react-router-dom";
import "./confirmOrder.css";
import { createPedido } from "../../../../services/pedidoService";

type TipoEnvio = "TAKE_AWAY" | "DELIVERY";
type FormaPago = "EFECTIVO" | "MP";

const ConfirmOrder = () => {
    const { items, total, clearCart } = useCart();
    const { user } = useUser();
    const { sucursalId } = useSucursal();
    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio | null>(null);
    const [formaPago, setFormaPago] = useState<FormaPago | null>(null);

    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login", {
                state: { redirectTo: "/confirm-order" },
                replace: true,
            });
        }
    }, [user, navigate]);

    if (!user || items.length === 0) {
        return <p className="text-muted p-4">No hay productos en el carrito</p>;
    }

    const descuento = tipoEnvio === "TAKE_AWAY" ? total * 0.1 : 0;
    const totalFinal = total - descuento;

    const confirmarPedido = async () => {
        if (!tipoEnvio) {
            alert("Elegí si es retiro o delivery");
            return;
        }
        if (!formaPago) {
            alert("Elegí la forma de pago");
            return;
        }
        if (!sucursalId) {
            alert("Elegí una sucursal");
            return;
        }
        const payload = {
            clienteId: Number(user.userId),
            sucursalId: sucursalId!,
            tipoEnvio,
            formaPago,
            descuento,
            observaciones: "",
            detalles: items.map(i => ({
                manufacturadoId: i.manufacturadoId,
                cantidad: i.cantidad,
            })),
        };
        console.log("payload", payload);
        try {
            const pedidoCreado = await createPedido(payload);
            console.log("pedidoCreado", pedidoCreado);
            clearCart();
            navigate(`/pedido/${pedidoCreado.id}`);
        } catch (error: any) {
            alert(
                error.response?.data?.message ||
                "No se pudo confirmar el pedido"
            );
        }
    };

    return (
        <div className="confirm-order-container">
            <h3 className="mb-4">Confirmar pedido</h3>
            <hr />
            {step === 1 && (
                <>
                    <h5>Forma de entrega</h5>

                    <div className="d-flex gap-2 mb-3">
                        <button
                            className={`btn ${tipoEnvio === "TAKE_AWAY"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => setTipoEnvio("TAKE_AWAY")}
                        >
                            Retiro en local (10% OFF)
                        </button>

                        <button
                            className={`btn ${tipoEnvio === "DELIVERY"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => setTipoEnvio("DELIVERY")}
                        >
                            Envío a domicilio
                        </button>
                    </div>

                    {tipoEnvio === "DELIVERY" && (
                        <>
                            <input
                                className="form-control mb-2"
                                placeholder="Dirección"
                                value={direccion}
                                onChange={e => setDireccion(e.target.value)}
                            />
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Teléfono"
                                value={telefono}
                                onChange={e => setTelefono(e.target.value)}
                            />
                        </>
                    )}

                    <button
                        className="btn btn-success"
                        disabled={!tipoEnvio}
                        onClick={() => setStep(2)}
                    >
                        Continuar
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <h5>Forma de pago</h5>

                    <div className="d-flex gap-2 mb-3">
                        {tipoEnvio === "TAKE_AWAY" && (
                            <button
                                className={`btn ${formaPago === "EFECTIVO"
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                                }`}
                                onClick={() => setFormaPago("EFECTIVO")}
                            >
                                Efectivo
                            </button>
                        )}

                        <button
                            className={`btn ${formaPago === "MP"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => setFormaPago("MP")}
                        >
                            Mercado Pago
                        </button>
                    </div>

                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => setStep(1)}
                    >
                        Volver
                    </button>

                    <button
                        className="btn btn-success"
                        disabled={!formaPago}
                        onClick={() => setStep(3)}
                    >
                        Continuar
                    </button>
                </>
            )}

            {step === 3 && (
                <>
                    <h5>Resumen del pedido</h5>

                    {items.map(item => (
                        <div key={item.manufacturadoId} className="d-flex justify-content-between">
                            <span>
                                {item.denominacion} x{item.cantidad}
                            </span>
                            <span>${item.precio * item.cantidad}</span>
                        </div>
                    ))}

                    <hr />
                    <p>Subtotal: ${total}</p>
                    {descuento > 0 && <p>Descuento: -${descuento}</p>}
                    <strong>Total: ${totalFinal}</strong>

                    <div className="mt-3">
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => setStep(2)}
                        >
                            Volver
                        </button>

                        <button
                            className="btn btn-success"
                            onClick={confirmarPedido}
                        >
                            Confirmar pedido
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConfirmOrder;