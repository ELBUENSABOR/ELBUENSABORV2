import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "../models/CartItem";

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (manufacturadoId: number) => void;
    updateQuantity: (manufacturadoId: number, cantidad: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.manufacturadoId === item.manufacturadoId);
            if (existing) {
                return prev.map(i =>
                    i.manufacturadoId === item.manufacturadoId
                        ? { ...i, cantidad: i.cantidad + item.cantidad }
                        : i
                );
            }
            return [...prev, item];
        });
    };

    const removeItem = (manufacturadoId: number) => {
        setItems(prev => prev.filter(i => i.manufacturadoId !== manufacturadoId));
    };

    const updateQuantity = (manufacturadoId: number, cantidad: number) => {
        setItems(prev =>
            prev.map(i =>
                i.manufacturadoId === manufacturadoId
                    ? { ...i, cantidad }
                    : i
            )
        );
    };

    const clearCart = () => setItems([]);

    const total = useMemo(
        () => items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
        [items]
    );

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
    return ctx;
};