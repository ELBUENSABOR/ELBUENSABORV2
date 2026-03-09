import {useEffect, useState} from "react";
import {useCart} from "../../../../contexts/CartContext";
import {useUser} from "../../../../contexts/UsuarioContext";
import {useSucursal} from "../../../../contexts/SucursalContext";
import {useNavigate} from "react-router-dom";
import "./confirmOrder.css";
import {createPedido} from "../../../../services/pedidoService";
import {pagarConMercadoPago} from "../../../../services/pagoService";
import {getUserService} from "../../../../services/userService";
import type {UsuarioDTO} from "../../../../dtos/UsuarioDTO";

type TipoEnvio = "TAKE_AWAY" | "DELIVERY";
type FormaPago = "EFECTIVO" | "MP";

const ConfirmOrder = () => {
    const {items, total, clearCart} = useCart();
    const {user} = useUser();
    const {sucursalId, sucursales, setSucursalId, loading} = useSucursal();
    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio | null>(null);
    const [formaPago, setFormaPago] = useState<FormaPago | null>(null);

    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [usuarioInfo, setUsuarioInfo] = useState<UsuarioDTO | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login", {
                state: {redirectTo: "/confirm-order"},
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

    const descuento = tipoEnvio === "TAKE_AWAY" ? total * 0.1 : 0;
    const costoEnvio = tipoEnvio === "DELIVERY" ? 500 : 0;
    const totalFinal = total - descuento + costoEnvio;
    const puedeContinuarStep1 = (() => {
        if (!tipoEnvio) return false;
        if (!sucursalId) return false;
        if (tipoEnvio === "DELIVERY") {
            return Boolean(direccion.trim() && telefono.trim());
        }
        return true;
    })();
    const sucursalSeleccionada = sucursales.find((s) => s.id === sucursalId);

    if (!user || items.length === 0) {
        return (
            <div className="confirm-order-empty-state">
                <p className="text-muted mb-0">No hay productos en el carrito</p>
            </div>
        );
    }

    const confirmarPedido = async () => {
        if (isSubmitting) return;
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
            setIsSubmitting(true);
            const pedidoCreado = await createPedido(payload);
            if (formaPago === "MP") {
                const initPoint = await pagarConMercadoPago(pedidoCreado.id);
                clearCart();
                window.location.href = initPoint;
                return;
            }
            clearCart();
            navigate(`/pedido/${pedidoCreado.id}`);
        } catch (error: any) {
            const backendMessage = error.response?.data?.message;
            const backendError = error.response?.data?.error;
            const detalles =
                typeof backendError === "string" && backendError.trim().length > 0
                    ? ` Detalle: ${backendError}`
                    : "";
            alert(
                backendMessage
                    ? `${backendMessage}${detalles}`
                    : "No se pudo confirmar el pedido"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="confirm-order-container">
            <h3 className="confirm-order-title">Confirmar pedido</h3>
            <hr/>
            {step === 1 && (
                <>
                    <h5>Forma de entrega</h5>

                    <div className="mb-3">
                        <label className="form-label">Sucursal</label>
                        <select
                            className="form-select"
                            value={sucursalId ?? ""}
                            onChange={(event) =>
                                setSucursalId(
                                    event.target.value
                                        ? Number(event.target.value)
                                        : null
                                )
                            }
                            disabled={loading || sucursales.length === 0}
                        >
                            <option value="">Seleccioná una sucursal...</option>
                            {sucursales.map((sucursal) => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                        {!sucursalId && (
                            <small className="text-danger">
                                Elegí una sucursal para continuar con el pedido.
                            </small>
                        )}
                    </div>

                    <div className="confirm-order-actions-row">
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
                        className="btn btn-success confirm-order-cta"
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

                    <div className="confirm-order-navigation">
                        <button
                            className="btn btn-secondary"
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
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <h5>Resumen del pedido</h5>

                    {items.map(item => (
                        <div key={item.manufacturadoId} className="confirm-order-summary-item">
                            <span>
                                {item.denominacion} x{item.cantidad}
                            </span>
                            <span>${item.precio * item.cantidad}</span>
                        </div>
                    ))}

                    <hr/>
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
                    <p>
                        Sucursal: {sucursalSeleccionada?.nombre ?? "Sin selección"}
                    </p>
                    <strong>Total: ${totalFinal}</strong>

                    <div className="confirm-order-navigation mt-3">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setStep(2)}
                        >
                            Volver
                        </button>

                        <button
                            className="btn btn-success"
                            onClick={confirmarPedido}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Confirmando..." : "Confirmar pedido"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConfirmOrder;