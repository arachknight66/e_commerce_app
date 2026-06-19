import { createContext, useState, useEffect, useCallback } from "react";

import * as cartService from "../services/cartService";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext(null);

const EMPTY_CART = { items: [], totalItems: 0, totalPrice: 0 };

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState(EMPTY_CART);
    const [isLoading, setIsLoading] = useState(false);

    // ── Load the cart once the user is signed in, and wipe it the moment
    // they're not — otherwise the next account on this device would briefly
    // inherit whatever was left over from the last session. ────────────────────
    useEffect(() => {
        if (!isAuthenticated) {
            setCart(EMPTY_CART);
            return;
        }

        (async () => {
            setIsLoading(true);
            try {
                const fetchedCart = await cartService.getCart();
                setCart(fetchedCart);
            } catch (error) {
                // Swallow here — an empty cart is a safe fallback on failure, and
                // the screen that actually needs the cart owns its own retry/error UI.
            } finally {
                setIsLoading(false);
            }
        })();
    }, [isAuthenticated]);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedCart = await cartService.getCart();
            setCart(fetchedCart);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addItem = useCallback(async (productId, quantity = 1) => {
        const updatedCart = await cartService.addToCart(productId, quantity);
        setCart(updatedCart);
        return updatedCart;
    }, []);

    const updateItem = useCallback(async (itemId, quantity) => {
        const updatedCart = await cartService.updateCartItem(itemId, quantity);
        setCart(updatedCart);
        return updatedCart;
    }, []);

    const removeItem = useCallback(async (itemId) => {
        const updatedCart = await cartService.removeFromCart(itemId);
        setCart(updatedCart);
        return updatedCart;
    }, []);

    const clear = useCallback(async () => {
        await cartService.clearCart();
        setCart(EMPTY_CART);
    }, []);

    const value = {
        items: cart.items || [],
        totalItems: cart.totalItems || 0,
        totalPrice: cart.totalPrice || 0,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clear,
        refresh,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}