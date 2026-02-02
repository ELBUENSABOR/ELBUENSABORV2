import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../../../contexts/CartContext";
import { useUser } from "../../../../contexts/UsuarioContext";
import { useSucursal } from "../../../../contexts/SucursalContext";
import { useNavigate } from "react-router-dom";
import "./confirmOrder.css";
import { createPedido } from "../../../../services/pedidoService";
import { getUserService } from "../../../../services/userService";
import type { UsuarioDTO } from "../../../../dtos/UsuarioDTO";

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
    const [usuarioInfo, setUsuarioInfo] = useState<UsuarioDTO | null>(null);

    useEffect(() => {
        if (!user) {
            navigate("/login", {
                state: { redirectTo: "/confirm-order" },
                replace: true,
            });
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user?.userId) return;

        getUserService(user.userId)
            .then(res => {
                const data = res.data as UsuarioDTO;
                setUsuarioInfo(data);
            })
            .catch(() => null);
    }, [user?.userId]);

    useEffect(() => {
        if (!usuarioInfo) return;

        if (!direccion) {
            const domicilio = usuarioInfo.domicilio;
            if (domicilio?.calle && domicilio?.numero) {
                setDireccion(
                    `${domicilio.calle} ${domicilio.numero}`
                );
            }
        }

        if (!telefono && usuarioInfo.telefono) {
            setTelefono(usuarioInfo.telefono);
        }
    }, [usuarioInfo, direccion, telefono]);

    useEffect(() => {
        if (tipoEnvio === "DELIVERY") {
            setFormaPago("MP");
        }
    }, [tipoEnvio]);

    if (!user || items.length === 0) {
        return <p className="text-muted p-4">No hay productos en el carrito</p>;
    }

    const descuento = tipoEnvio === "TAKE_AWAY" ? total * 0.1 : 0;
    const costoEnvio = tipoEnvio === "DELIVERY" ? 500 : 0;
    const totalFinal = total - descuento + costoEnvio;
    const puedeContinuarStep1 = useMemo(() => {
        if (!tipoEnvio) return false;
        if (tipoEnvio === "DELIVERY") {
            return Boolean(direccion.trim() && telefono.trim());
        }
        return true;
    }, [tipoEnvio, direccion, telefono]);

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
        if (tipoEnvio === "DELIVERY" && (!direccion.trim() || !telefono.trim())) {
            alert("Completá dirección y teléfono para el envío");
            return;
        }
        const payload = {
            clienteId: Number(user.userId),
            sucursalId: sucursalId!,
            tipoEnvio,
            formaPago,
            descuento,
            observaciones: "",
            direccionEntrega: tipoEnvio === "DELIVERY" ? direccion : undefined,
            telefonoEntrega: tipoEnvio === "DELIVERY" ? telefono : undefined,
            detalles: items.map(i => ({
                manufacturadoId: i.manufacturadoId,
                cantidad: i.cantidad,
            })),
        };
        try {
            const pedidoCreado = await createPedido(payload);
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
                                className="form-control mb-2"
                                placeholder="Teléfono"
                                value={telefono}
                                onChange={e => setTelefono(e.target.value)}
                            />
                            <small className="text-muted">
                                Podés modificar los datos de entrega si es necesario.
                            </small>
                        </>
                    )}

                    <button
                        className="btn btn-success"
                        disabled={!puedeContinuarStep1}
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
                    {costoEnvio > 0 && <p>Envío: ${costoEnvio}</p>}
                    <p>
                        Entrega:{" "}
                        {tipoEnvio === "DELIVERY" ? "Envío a domicilio" : "Retiro en local"}
                    </p>
                    {tipoEnvio === "DELIVERY" && (
                        <>
                            <p>Dirección: {direccion}</p>
                            <p>Teléfono: {telefono}</p>
                        </>
                    )}
                    <p>
                        Forma de pago:{" "}
                        {formaPago === "MP" ? "Mercado Pago" : "Efectivo"}
                    </p>
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