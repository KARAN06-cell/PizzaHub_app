import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

// Each cart line is keyed by pizzaId + size, so the same pizza in two
// different sizes shows as two separate lines.
const lineKey = (pizzaId, size) => `${pizzaId}__${size}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { key, pizzaId, name, size, price, quantity, image, maxStock }

  const addItem = (pizza, size, price, quantity = 1) => {
    const key = lineKey(pizza._id, size);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, quantity: Math.min(i.quantity + quantity, pizza.stock) }
            : i
        );
      }
      return [
        ...prev,
        {
          key,
          pizzaId: pizza._id,
          name: pizza.name,
          image: pizza.image,
          size,
          price,
          quantity,
          maxStock: pizza.stock,
        },
      ];
    });
  };

  const updateQuantity = (key, quantity) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));

  const clearCart = () => setItems([]);

  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalAmount, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
