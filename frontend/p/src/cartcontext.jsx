import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const itemToAdd = {
      ...item,
      price: parseFloat(item.price) || 0, // Ensure price is stored as a number
    };
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === itemToAdd._id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === itemToAdd._id
            ? { ...cartItem, quantity: cartItem.quantity + itemToAdd.quantity }
            : cartItem
        );
      }
      return [...prevCart, itemToAdd];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};