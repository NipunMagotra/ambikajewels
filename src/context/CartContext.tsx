'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { CartItem } from '@/types';

type CartState = {
  items: CartItem[];
  lastAddedItem?: CartItem | null;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { product_id: string; metal_finish: string; selected_size?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { product_id: string; metal_finish: string; quantity: number; selected_size?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_TOAST' }
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
        (item) => item.product_id === action.payload.product_id && 
                  item.metal_finish === action.payload.metal_finish &&
                  (item.selected_size || '') === (action.payload.selected_size || '')
      );
      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems, lastAddedItem: action.payload };
      }
      return { ...state, items: [...state.items, action.payload], lastAddedItem: action.payload };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.product_id === action.payload.product_id && 
                      item.metal_finish === action.payload.metal_finish &&
                      (item.selected_size || '') === ((action.payload as any).selected_size || ''))
        ),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.product_id === action.payload.product_id && 
          item.metal_finish === action.payload.metal_finish &&
          (item.selected_size || '') === ((action.payload as any).selected_size || '')
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_TOAST':
      return { ...state, lastAddedItem: null };
    case 'CLEAR_CART':
      return { items: [], lastAddedItem: null };
    case 'LOAD_CART':
      return { ...action.payload, lastAddedItem: null };
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  lastAddedItem: null,
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

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

const defaultCartContext: {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  cartCount: number;
  cartTotal: number;
} = {
  state: initialState,
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
