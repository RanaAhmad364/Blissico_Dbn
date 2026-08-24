import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'blissico_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Each card is a one-off digital item — no quantity concept, just in-cart or not.
  const addToCart = (card) => {
    setItems((prev) => (prev.some((i) => i.id === card.id) ? prev : [...prev, card]));
  };

  const removeFromCart = (cardId) => {
    setItems((prev) => prev.filter((i) => i.id !== cardId));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);







