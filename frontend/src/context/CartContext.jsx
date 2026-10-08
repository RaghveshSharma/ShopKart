import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    const fetchCart = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/cart');
            if (response.data.success) {
                setCartItems(response.data.cart);
                setIsLoggedIn(true);
                localStorage.setItem('isLoggedIn', 'true');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Not logged in, that's fine
                setCartItems([]);
                setIsLoggedIn(false);
                localStorage.setItem('isLoggedIn', 'false');
            } else {
                setError('Unable to load your cart.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (productId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`/cart/${productId}`);
            if (response.data.success) {
                setCartItems(response.data.cart);
                return { success: true };
            }
        } catch (err) {
            let message = 'Failed to add to cart';
            if (err.response) {
                if (err.response.status === 401) {
                    message = 'unauthorized';
                } else {
                    message = err.response.data.message || message;
                }
            }
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await api.patch(`/cart/${productId}`, { quantity });
            if (response.data.success) {
                setCartItems(response.data.cart);
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update quantity' };
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await api.delete(`/cart/${productId}`);
            if (response.data.success) {
                setCartItems(response.data.cart);
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: 'Failed to remove item' };
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    };

    const emptyCart = () => {
        setCartItems([]);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            error,
            fetchCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            emptyCart,
            subtotal,
            totalItems,
            isLoggedIn,
            setIsLoggedIn
        }}>
            {children}
        </CartContext.Provider>
    );
};
