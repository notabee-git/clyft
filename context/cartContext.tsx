
import React, { createContext, useContext, useState, ReactNode } from 'react';

import { CartItem, WideItemFb, Variant, PriceTier } from '@/constants/types';





interface CartContextType {
  cart: CartItem[];
  addToCart: (item: { product: WideItemFb; variantIndex: number; quantity?: number }) => void;
  incrementItem: (productName: string, variantIndex: number) => void;
  decrementItem: (productName: string, variantIndex: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

// Context setup
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

// 🔢 Slab price logic
const getSlabPrice = (variant: Variant, quantity: number): number => {
  const slab = variant.priceTiers.find((s) => quantity >= s.min && quantity <= s.max);
  return slab ? slab.price : 0;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

const addToCart = (item: { product: WideItemFb; variantIndex: number; quantity?: number; }) => {
  const quantity = item.quantity ?? 1;
  const variant = item.product.variants[item.variantIndex];
  const price = getSlabPrice(variant, quantity);

  setCart((prevCart) => {
    const existing = prevCart.find(
      (i) => i.product.name === item.product.name && i.variantIndex === item.variantIndex
    );

    if (existing) {
      return prevCart.map((i) => {
        if (i.product.name === item.product.name && i.variantIndex === item.variantIndex) {
          const newQuantity = i.quantity + quantity;
          const newPricePerPiece = getSlabPrice(variant, newQuantity);
          return { ...i, quantity: newQuantity, price: newPricePerPiece };
        }
        return i;
      });
    }

    return [...prevCart, { ...item, quantity, price }];
  });
};

    const incrementItem = (productName: string, variantIndex: number) => {
      setCart(prevCart =>
        prevCart.map(item => {
          if (item.product.name === productName && item.variantIndex === variantIndex) {
            const newQty = item.quantity + 1;
            const variant = item.product.variants[variantIndex];
            const newPrice = getSlabPrice(variant, newQty); // 🟢 use existing function

            return {
              ...item,
              quantity: newQty,
              price: newPrice,
            };
          }
          return item;
        })
      );
    };

    const decrementItem = (productName: string, variantIndex: number) => {
      setCart(prevCart =>
        prevCart
          .map(item => {
            if (item.product.name === productName && item.variantIndex === variantIndex) {
              const newQty = Math.max(1, item.quantity - 1);
              const variant = item.product.variants[variantIndex];
              const newPrice = getSlabPrice(variant, newQty); // 🟢 use existing function

              return {
                ...item,
                quantity: newQty,
                price: newPrice,
              };
            }
            return item;
          })
          .filter(item => item.quantity > 0) // optional: remove item if qty is 0
      );
    };


  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((total, item) => {
    const variant = item.product.variants[item.variantIndex];
    const pricePerPiece = getSlabPrice(variant, item.quantity);
    return total + pricePerPiece * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, incrementItem, decrementItem, clearCart, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};
