import { createContext, useContext, useMemo, useState } from "react";
import type { Manufacturado } from "../models/Manufacturado";

interface CartItem {
  product: Manufacturado;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Manufacturado) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Manufacturado) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () =>
      items.reduce(
        (acc, item) => acc + item.product.precioVenta * item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};
