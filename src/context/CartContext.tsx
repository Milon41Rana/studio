'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { useUser, useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';


export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    if (!auth || isUserLoading || user) return;
    initiateAnonymousSignIn(auth);
  }, [user, isUserLoading, auth]);

  const cartRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'carts', user.uid) : null),
    [firestore, user]
  );
  
  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !cartRef) {
          if (!isUserLoading) {
            setIsCartLoading(false);
            setCart([]);
          }
          return;
      }
      
      setIsCartLoading(true);
      try {
        const docSnap = await getDoc(cartRef);
        if (docSnap.exists()) {
          setCart(docSnap.data().items || []);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsCartLoading(false);
      }
    };
    fetchCart();
  }, [cartRef, user, isUserLoading]);

  const updateFirestoreCart = (newCart: CartItem[]) => {
    if (cartRef) {
      setDocumentNonBlocking(cartRef, { items: newCart }, { merge: false }); // Overwrite cart
    }
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      updateFirestoreCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      let newCart;
      if (quantity <= 0) {
        newCart = prevCart.filter((item) => item.id !== productId);
      } else {
        newCart = prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
      }
      updateFirestoreCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);
      updateFirestoreCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (cartRef) {
        setDocumentNonBlocking(cartRef, { items: [] }, { merge: false });
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, isCartLoading }}>
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
