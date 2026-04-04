import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        productId,
        quantity
      });
      setCart(response.data);
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/cart/update/${productId}`, {
        quantity
      });
      setCart(response.data);
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`);
      setCart(response.data);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const getCartTotal = () => {
    if (!cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    if (!cart.items) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      getCartTotal,
      getCartCount,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};