'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, CartItem, Product } from '@/types';
import { authAPI } from '@/lib/api';
import { t } from '@/lib/translations';

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  lang: string;
  setLang: (l: string) => void;
  translate: (key: string) => string;
  loading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lang, setLangState] = useState('en');
  const [loading, setLoading] = useState(true);

  const setLang = (l: string) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
  };

  const translate = useCallback((key: string) => t(lang, key), [lang]);

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'en';
    setLangState(savedLang);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const token = localStorage.getItem('access_token');
    if (token) {
      authAPI.profile().then(({ data }) => setUser(data)).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: number) => setCart(prev => prev.filter(i => i.product.id !== productId));

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((s, i) => s + parseFloat(i.product.price) * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <AppContext.Provider value={{
      user, setUser, cart, addToCart, removeFromCart, updateQty, clearCart,
      cartTotal, cartCount, lang, setLang, translate, loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
