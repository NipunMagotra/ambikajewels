'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { CartItem } from '@/types';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { product_id: string; metal_finish: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { product_id: string; metal_finish: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  cartCount: number;
  cartTotal: number;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product_id === action.payload.product_id && item.metal_finish === action.payload.metal_finish
      );
      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.product_id === action.payload.product_id && item.metal_finish === action.payload.metal_finish)
        ),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.product_id === action.payload.product_id && item.metal_finish === action.payload.metal_finish
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const savedCart = localStorage.getItem('ambika_cart');
    if (savedCart) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ambika_cart', JSON.stringify(state));
  }, [state]);

  const cartCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

const defaultCartContext = {
  state: { items: [] },
  dispatch: (() => {}) as React.Dispatch<CartAction>,
  cartCount: 0,
  cartTotal: 0,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return defaultCartContext;
  }
  return context;
};
