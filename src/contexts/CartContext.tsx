import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CartItem, Product, DomainOption } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, billingCycle: string, price: number, domain?: string, domainOption?: DomainOption) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, billingCycle: string, price: number, domain?: string, domainOption?: DomainOption) => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      product,
      billing_cycle: billingCycle,
      price,
      domain,
      domain_option: domainOption,
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount: items.length }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
