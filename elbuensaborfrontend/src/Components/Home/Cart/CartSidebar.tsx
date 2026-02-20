import "./cartSidebar.css";
import {useCart} from "../../../contexts/CartContext";
import {Package, Trash2} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {getImageUrl} from "../../../utils/image";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value);

interface CartSidebarProps {
    variant?: "static" | "drawer";
    isOpen?: boolean;
    onClose?: () => void;
}

const CartSidebar = ({
                         variant = "static",
                         isOpen = false,
                         onClose,
                     }: CartSidebarProps) => {
    const navigate = useNavigate();
    const {items, removeItem, updateQuantity, clearCart, total} = useCart();
    const isDrawer = variant === "drawer";

    return (
        <>
            {isDrawer && (
                <div
                    className={`cart-sidebar__overlay${isOpen ? " is-open" : ""}`}
                    onClick={onClose}
                />
            )}

            <aside
                className={`cart-sidebar${
                    isDrawer ? " cart-sidebar--drawer" : ""
                }${isDrawer && isOpen ? " is-open" : ""}`}
                aria-hidden={isDrawer && !isOpen}
            >
                <div className="cart-sidebar__header">
                    <div className="cart-sidebar__title">
                        <Package/>
                        <h5>Tu pedido</h5>
                    </div>
                    <div className="cart-sidebar__actions">
                        {isDrawer && (
                            <button
                                type="button"
                                className="cart-sidebar__close"
                                onClick={onClose}
                                aria-label="Cerrar carrito"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="cart-sidebar__empty">
                        <div className="cart-sidebar__empty-icon">
                            <Package/>
                        </div>
                        <p>Tu carrito está vacío</p>
                        <span>¡Agregá productos deliciosos!</span>
                    </div>
                ) : (
                    <div className="cart-sidebar__list">
                        {items.map((item) => (
                            <div className="cart-sidebar__item" key={item.manufacturadoId}>
                                <div className="cart-sidebar__item-media">
                                    {item.imagen ? (
                                        <img
                                            src={getImageUrl(item.imagen)}
                                            alt={item.denominacion}
                                        />
                                    ) : (
                                        <div className="cart-sidebar__item-placeholder">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>
                                <div className="cart-sidebar__item-body">
                                    <p className="cart-sidebar__name">
                                        {item.denominacion}
                                    </p>
                                    <span className="cart-sidebar__price">
                                        {formatCurrency(item.precio)}
                                    </span>
                                    <div className="cart-sidebar__quantity">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.manufacturadoId,
                                                    Math.max(1, item.cantidad - 1)
                                                )
                                            }
                                            aria-label={`Disminuir ${item.denominacion}`}
                                            disabled={item.cantidad <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="cart-sidebar__quantity-value">
                                            {item.cantidad}
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.manufacturadoId,
                                                    item.cantidad + 1
                                                )
                                            }
                                            aria-label={`Aumentar ${item.denominacion}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="cart-sidebar__delete"
                                    onClick={() => removeItem(item.manufacturadoId)}
                                    aria-label={`Eliminar ${item.denominacion}`}
                                >
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="cart-sidebar__footer">
                    <div className="cart-sidebar__total">
                        <span>Total</span>
                        <strong>{formatCurrency(total)}</strong>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary w-100"
                        disabled={items.length === 0}
                        onClick={() => {
                            navigate("/confirm-order");
                            onClose?.();
                        }}
                    >
                        Confirmar pedido
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary w-100"
                        onClick={clearCart}
                        disabled={items.length === 0}
                    >
                        Vaciar carrito
                    </button>
                </div>
            </aside>
        </>
    );
};

export default CartSidebar;
