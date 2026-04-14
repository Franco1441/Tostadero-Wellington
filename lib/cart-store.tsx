'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { MenuItem } from './menu-data';
import { calculateCartPricing, validateCoupon } from './pricing';
import type { Promotion } from './promotions-data';

const STORAGE_KEY = 'tostadero-cart';
const MAX_ITEM_QUANTITY = 99;

export interface CartItem extends MenuItem {
  quantity: number;
}

interface PersistedCartState {
  items: CartItem[];
  appliedCouponCode: string | null;
}

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  discount: number;
  appDiscount: number;
  couponDiscount: number;
  appliedCouponCode: string | null;
  appliedPromotion: Promotion | null;
  total: number;
  isOpen: boolean;
  hasHydrated: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function readPersistedCart(): PersistedCartState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as PersistedCartState;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const persistedState = readPersistedCart();

      if (persistedState) {
        setItems(Array.isArray(persistedState.items) ? persistedState.items : []);
        setAppliedCouponCode(persistedState.appliedCouponCode ?? null);
      }

      setHasHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const pricing = useMemo(
    () => calculateCartPricing(items, appliedCouponCode),
    [appliedCouponCode, items],
  );

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') {
      return;
    }

    const payload: PersistedCartState = {
      items,
      appliedCouponCode: pricing.appliedCouponCode,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [hasHydrated, items, pricing.appliedCouponCode]);

  const addItem = useCallback((item: MenuItem) => {
    setItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: Math.min(MAX_ITEM_QUANTITY, cartItem.quantity + 1) }
            : cartItem,
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.id !== id));
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(MAX_ITEM_QUANTITY, quantity) }
          : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCouponCode(null);
  }, []);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const applyCoupon = useCallback(
    (code: string) => {
      const result = validateCoupon(code, items);

      if (!result.success || !result.promotion?.code) {
        return { success: false, message: result.message };
      }

      setAppliedCouponCode(result.promotion.code);
      return { success: true, message: result.message };
    },
    [items],
  );

  const removeCoupon = useCallback(() => {
    setAppliedCouponCode(null);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        appDiscount: pricing.appDiscount,
        couponDiscount: pricing.couponDiscount,
        appliedCouponCode: pricing.appliedCouponCode,
        appliedPromotion: pricing.appliedPromotion,
        total: pricing.total,
        isOpen,
        hasHydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        getItemCount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartStore() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartStore must be used within CartProvider');
  }

  return context;
}
