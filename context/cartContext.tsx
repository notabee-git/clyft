import React, { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = {
  name: string;   // unique identifier
  image: string;
  price: number;
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: { name: string; price: number; image: string; quantity?: number }) => void;
  incrementItem: (name: string) => void;
  decrementItem: (name: string) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: { name: string; price: number; image: string; quantity?: number }) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.name === item.name);
      if (existing) {
        // If item exists, increment the quantity by incoming quantity (default to 1)
        return prevCart.map((i) =>
          i.name === item.name
            ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
            : i
        );
      }
      // Add new item with quantity default to 1 if not provided
      return [...prevCart, { ...item, quantity: item.quantity ?? 1 }];
    });
  };

  const incrementItem = (name: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementItem = (name: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.name === name
            ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
            : item
        )
        // Remove item if quantity is 0
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, incrementItem, decrementItem, clearCart, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};
