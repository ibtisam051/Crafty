import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeFromCart as apiRemoveFromCart,
} from '../services/api';

const CartContext = createContext();

// Custom hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('localCart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      const items = response.data.items || [];
      setCartItems(
        items.map((i) =>
          i.product ? { ...i, id: i.id, product: i.product, quantity: i.quantity } : i,
        ),
      );
    } catch (error) {
      console.error('Error fetching cart:', error);
      // fallback: keep local cart state
    }
  };

  // persist cart to localStorage so anonymous adds survive navigation/reloads
  useEffect(() => {
    try {
      localStorage.setItem('localCart', JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    try {
      const response = await apiAddToCart({ product_id: product.id, quantity });
      setCartItems(response.data.items || []);
      return;
    } catch (error) {
      console.error('Error adding to cart (API fallback):', error);
      // fallback to local cart behavior for unauthorized / no backend access
      setCartItems((prev) => {
        const existing = prev.find(
          (item) => item.product?.id === product.id || item.id === product.id,
        );
        if (existing) {
          return prev.map((item) =>
            item.product?.id === product.id || item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...prev, { id: product.id, product, quantity }];
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      const response = await apiRemoveFromCart({ item_id: itemId });
      setCartItems(response.data.items || []);
      return;
    } catch (error) {
      console.error('Error removing from cart (API fallback):', error);
      setCartItems((prev) =>
        prev.filter((item) => item.id !== itemId && item.product?.id !== itemId),
      );
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      const response = await updateCartItem({ item_id: itemId, quantity });
      setCartItems(response.data.items || []);
      return;
    } catch (error) {
      console.error('Error updating cart (API fallback):', error);
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === itemId || item.product?.id === itemId) {
            return { ...item, quantity: quantity > 0 ? quantity : 0 };
          }
          return item;
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
