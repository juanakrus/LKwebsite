'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (name: string, price: number) => void;
  removeItem: (name: string) => void;
  updateQuantity: (name: string, delta: number) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('localKitchenCart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        setItems([]);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('localKitchenCart', JSON.stringify(items));
    if (items.length === 0) {
      localStorage.removeItem('localKitchenTempAddons');
    }
  }, [items, isHydrated]);

  const addItem = useCallback((name: string, price: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.name === name);
      if (existing) {
        return prev.map(item =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { name, price, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((name: string) => {
    setItems(prev => prev.filter(item => item.name !== name));
  }, []);

  const updateQuantity = useCallback((name: string, delta: number) => {
    setItems(prev => {
      const item = prev.find(i => i.name === name);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return prev.filter(i => i.name !== name);
      }
      return prev.map(i =>
        i.name === name ? { ...i, quantity: newQty } : i
      );
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        isOpen,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
      }}
    >
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
