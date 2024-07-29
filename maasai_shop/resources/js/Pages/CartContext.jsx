import React, { createContext, useReducer, useContext } from 'react';
import { useRemember } from '@inertiajs/react'

// Initial state
const initialState = {
  cart: [],
  total: 0,
};

// Create context
const CartContext = createContext(initialState);

// Reducer
const cartReducer = (state, action) => {
  const calculateTotal = (cart) => {
    return cart.reduce((acc, item) => acc + ( item.product.sale_price && item.product.price > item.product.sale_price ? item.product.sale_price:item.product.price ) * item.quantity, 0);
  };

  switch (action.type) {
    case 'ADD_TO_CART':
      const existingProductIndex = state.cart.findIndex(
        (item) => item.product.id === action.payload.id
      );

      if (existingProductIndex >= 0) {
        const newCart = [...state.cart];
        newCart[existingProductIndex].quantity += 1;
        const newState = { ...state, cart: newCart, total: calculateTotal(newCart) };
        console.log('Updated state:', newState); // Log the updated state
        return newState;
      } else {
        const newCart = [...state.cart, { product: action.payload, quantity: 1 }];
        const newState = { ...state, cart: newCart, total: calculateTotal(newCart) };
        console.log('Updated state:', newState); // Log the updated state
        return newState;
      }

    case 'INCREASE_QUANTITY':
      const increaseIndex = state.cart.findIndex(
        (item) => item.product.id === action.payload.id
      );

      if (increaseIndex >= 0) {
        const increasedCart = [...state.cart];
        increasedCart[increaseIndex].quantity += 1;
        return { ...state, cart: increasedCart, total: calculateTotal(increasedCart) };
      }
      return state;

    case 'DECREASE_QUANTITY':
      const decreaseIndex = state.cart.findIndex(
        (item) => item.product.id === action.payload.id
      );

      if (decreaseIndex >= 0) {
        const decreasedCart = [...state.cart];
        if (decreasedCart[decreaseIndex].quantity > 1) {
          decreasedCart[decreaseIndex].quantity -= 1;
        } else {
          decreasedCart.splice(decreaseIndex, 1);
        }
        return { ...state, cart: decreasedCart, total: calculateTotal(decreasedCart) };
      }
      return state;

    case 'DELETE_FROM_CART':
      const deleteIndex = state.cart.findIndex(
        (item) => item.product.id === action.payload.id
      );

      if (deleteIndex >= 0) {
        const newCart = state.cart.filter(
          (item) => item.product.id !== action.payload.id
        );
        return { ...state, cart: newCart, total: calculateTotal(newCart) };
      }
      return state;

    case 'CLEAR_CART':
      return { ...state, cart: [], total: 0 };

    default:
      return state;
  }
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const increaseQuantity = (product) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: product });
  };

  const decreaseQuantity = (product) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: product });
  };

  const deleteFromCart = (product) => {
    dispatch({ type: 'DELETE_FROM_CART', payload: product });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cart: state.cart, total: state.total, addToCart, increaseQuantity, decreaseQuantity, deleteFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};