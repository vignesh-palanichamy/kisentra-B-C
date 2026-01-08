'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/api/products';

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  orderId: string;
  orderDate: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getTotalItems: () => number;
  createOrder: (customerInfo: Order['customerInfo'], paymentMethod: string) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load cart and orders from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.Id === product.Id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.Id === product.Id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.Id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.Id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTax = () => {
    // 8% tax rate
    return getSubtotal() * 0.08;
  };

  const getShipping = () => {
    // Free shipping for orders over $100, otherwise $10
    return getSubtotal() >= 100 ? 0 : 10;
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getShipping();
  };

  // Legacy method for backward compatibility
  const getTotalPrice = () => {
    return getSubtotal();
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const createOrder = async (customerInfo: Order['customerInfo'], paymentMethod: string): Promise<Order> => {
    return new Promise((resolve, reject) => {
      // Simulate payment processing delay
      setTimeout(() => {
        const subtotal = getSubtotal();
        const tax = getTax();
        const shipping = getShipping();
        const total = subtotal + tax + shipping;

        // Generate unique order ID
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const newOrder: Order = {
          orderId,
          orderDate: new Date().toISOString(),
          items: [...cart],
          subtotal,
          tax,
          shipping,
          total,
          customerInfo,
          paymentMethod,
          status: 'completed', // In real app, this would be determined by payment gateway
        };

        // Simulate 5% payment failure rate
        const paymentSuccess = Math.random() > 0.05;

        if (paymentSuccess) {
          setOrders((prevOrders) => [newOrder, ...prevOrders]);
          resolve(newOrder);
        } else {
          const failedOrder: Order = {
            ...newOrder,
            status: 'failed',
          };
          setOrders((prevOrders) => [failedOrder, ...prevOrders]);
          reject(new Error('Payment processing failed. Please try again.'));
        }
      }, 2000); // 2 second delay to simulate payment processing
    });
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.orderId === orderId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getSubtotal,
        getTax,
        getShipping,
        getTotal,
        getTotalItems,
        createOrder,
        getOrderById,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};



