// src/context/CartContext.jsx

import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse cart items from localStorage", error);
            localStorage.removeItem('cartItems');
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
            console.error("Could not save cart items to localStorage. This may be due to storage limits.", error);
        }
    }, [cartItems]);
    
    // --- FIX: Update function to accept selected options ---
    const addToCart = (product, quantity, selectedColor, selectedSize) => {
        const cartItemId = `${product._id}-${Date.now()}`;
        
        const newItem = {
            cartItemId,
            productId: product._id,
            name: product.name,
            price: product.price,
            currency: product.currency || 'DZD',
            // --- FIX: Correctly access the nested thumbnail URL ---
            thumbnailUrl: product.imageUrls?.thumbnail, // Use optional chaining for safety
            availableColors: product.colors || [],
            availableSizes: product.sizes || [],
            quantity,
            // --- FIX: Store the initially selected color and size ---
            selectedColor,
            selectedSize
        };

        setCartItems(prevItems => [...prevItems, newItem]);
    };
    
    const removeFromCart = (cartItemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const updateItemOptions = (cartItemId, newOptions) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartItemId === cartItemId
                    ? { ...item, ...newOptions }
                    : item
            )
        );
    };
    
    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemOptions,
        clearCart,
        cartCount,
        totalPrice,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};