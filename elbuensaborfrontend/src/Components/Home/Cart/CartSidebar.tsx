import { useState } from "react";
import { useCart } from "../../../contexts/CartContext";
import "./cart.css";
import { useUser } from "../../../contexts/UsuarioContext";
import { useNavigate } from "react-router-dom";

const CartSidebar = () => {
    const { items, removeItem, updateQuantity, total } = useCart();
    const [open, setOpen] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate();

    const handleConfirmOrder = () => {
        if (!user) {
            console.log("No hay usuario logueado");
            navigate("/login", {
                state: {
                    from: "cart"
                }
            });
            return;
        }
        navigate("/confirm-order");
    }

    return (
        <>
            <button
                className="cart-toggle-btn"
                onClick={() => setOpen(!open)}
            >
                🛒 {items.length}
            </button>

            <div className={`cart-sidebar ${open ? "open" : ""}`}>
                <h5 className="d-flex justify-content-between align-items-center">
                    Carrito
                    <button
                        className="btn btn-sm btn-outline-secondary d-md-none"
                        onClick={() => setOpen(false)}
                    >
                        ✕
                    </button>
                </h5>

                {items.length === 0 ? (
                    <p className="text-muted">Sin productos</p>
                ) : (
                    <>
                        {items.map(item => (
                            <div
                                key={item.manufacturadoId}
                                className="mb-2 border-bottom pb-2"
                            >
                                <strong>{item.denominacion}</strong>

                                <div className="d-flex align-items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        value={item.cantidad}
                                        onChange={e =>
                                            updateQuantity(
                                                item.manufacturadoId,
                                                Number(e.target.value)
                                            )
                                        }
                                        className="form-control form-control-sm w-25"
                                    />
                                    <span>${item.precio * item.cantidad}</span>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeItem(item.manufacturadoId)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}

                        <hr />
                        <strong>Total: ${total}</strong>

                        <button className="btn btn-success w-100 mt-2" onClick={handleConfirmOrder}>
                            Confirmar pedido
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
