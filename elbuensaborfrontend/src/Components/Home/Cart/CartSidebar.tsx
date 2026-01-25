import "./cartSidebar.css";
import { useCart } from "../../../contexts/CartContext";
import {
    Package
} from "lucide-react";

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
  const { items, removeItem, clearCart, total } = useCart();
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
            {items.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={clearCart}
              >
                Vaciar
              </button>
            )}
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
              <div className="cart-sidebar__item" key={item.product.id}>
                <div>
                  <p className="cart-sidebar__name">
                    {item.product.denominacion}
                  </p>
                  <span className="cart-sidebar__meta">
                    {item.quantity} × {formatCurrency(item.product.precioVenta)}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeItem(item.product.id)}
                  aria-label={`Quitar ${item.product.denominacion}`}
                >
                  -
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
          >
            Confirmar pedido
          </button>
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;
