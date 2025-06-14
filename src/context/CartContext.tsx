'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  removeMultipleFromCart: (itemKeys: string[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper for deep comparison of CartItem objects
const areCartItemsEqual = (item1: CartItem, item2: CartItem): boolean => {
  return (
    item1.id === item2.id &&
    item1.name === item2.name &&
    item1.price === item2.price &&
    item1.quantity === item2.quantity &&
    item1.image === item2.image &&
    item1.size === item2.size &&
    item1.color === item2.color &&
    (item1.originalPrice === item2.originalPrice || (item1.originalPrice === undefined && item2.originalPrice === undefined))
  );
};

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => 
          item.id === newItem.id && 
          item.color === newItem.color && 
          item.size === newItem.size
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      } else {
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (id: string, color?: string, size?: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => 
        !(item.id === id && 
          item.color === color && 
          item.size === size)
      );
      // Only update if the cart actually changed to prevent unnecessary re-renders
      if (newCart.length === prevCart.length && newCart.every((item, index) => areCartItemsEqual(item, prevCart[index]))) {
        return prevCart; // Return the old reference if no actual change
      }
      return newCart;
    });
  };

  const updateQuantity = (id: string, quantity: number, color?: string, size?: string) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === id && item.color === color && item.size === size
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
      // Only update if the cart actually changed to prevent unnecessary re-renders
      if (newCart.length === prevCart.length && newCart.every((item, index) => areCartItemsEqual(item, prevCart[index]))) {
        return prevCart; // Return the old reference if no actual change
      }
      return newCart;
    });
  };

  const clearCart = () => {
    if (cart.length > 0) {
      setCart([]);
    }
  };

  const removeMultipleFromCart = (itemKeysToDelete: string[]) => {
    setCart(prevCart => {
      const keysToDeleteSet = new Set(itemKeysToDelete);
      const newCart = prevCart.filter(item => {
        const itemKey = `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`;
        return !keysToDeleteSet.has(itemKey);
      });
      // Only update if the cart actually changed to prevent unnecessary re-renders
      if (newCart.length === prevCart.length && newCart.every((item, index) => areCartItemsEqual(item, prevCart[index]))) {
        return prevCart; // Return the old reference if no actual change
      }
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, removeMultipleFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 