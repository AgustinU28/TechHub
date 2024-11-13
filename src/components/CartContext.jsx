import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product) => {
    setCartItems(prevItems => {
      const existingProduct = prevItems.find(item => item.id === product.id);
      if (existingProduct) {
        return prevItems.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const incrementQuantity = useCallback((productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);
  
  const decrementQuantity = useCallback((productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  }, []);
  
  const getItemTotal = useCallback((item) => {
    return item.price * item.quantity;
  }, []);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + getItemTotal(item), 0);
  }, [cartItems, getItemTotal]);

  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    getItemTotal,
    getTotalPrice
  }), [cartItems, addToCart, removeFromCart, incrementQuantity, decrementQuantity, getItemTotal, getTotalPrice]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};