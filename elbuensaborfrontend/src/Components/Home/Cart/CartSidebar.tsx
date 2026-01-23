import "./cartSidebar.css";
import { useCart } from "../../../contexts/CartContext";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const CartSidebar = () => {
  const { items, removeItem, clearCart, total } = useCart();

  return (
    <aside className="cart-sidebar">
      <div className="cart-sidebar__header">
        <div className="cart-sidebar__title">
          <span className="cart-sidebar__icon">🛍️</span>
          <h5>Tu pedido</h5>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={clearCart}
          >
            Vaciar
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="cart-sidebar__empty">
          <div className="cart-sidebar__empty-icon">🧺</div>
          <p>Tu carrito está vacío</p>
          <span>¡Agregá productos deliciosos!</span>
        </div>
      ) : (
        <div className="cart-sidebar__list">
          {items.map((item) => (
            <div className="cart-sidebar__item" key={item.product.id}>
              <div>
                <p className="cart-sidebar__name">{item.product.denominacion}</p>
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
  );
};

export default CartSidebar;
