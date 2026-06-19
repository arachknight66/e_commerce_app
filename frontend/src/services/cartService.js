import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

// ─── Fetch the current user's cart ─────────────────────────────────────────────
export const getCart = async () => {
    const { data } = await api.get(API_ENDPOINTS.CART);
    return data.data.cart;
};

// ─── Add a product to the cart (or bump its quantity if already present) ─────
export const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post(API_ENDPOINTS.ADD_TO_CART, { productId, quantity });
    return data.data.cart;
};

// ─── Set an item's quantity to an exact value ──────────────────────────────────
export const updateCartItem = async (itemId, quantity) => {
    const { data } = await api.patch(API_ENDPOINTS.UPDATE_CART_ITEM(itemId), { quantity });
    return data.data.cart;
};

// ─── Remove a single item from the cart ───────────────────────────────────────
export const removeFromCart = async (itemId) => {
    const { data } = await api.delete(API_ENDPOINTS.REMOVE_CART_ITEM(itemId));
    return data.data.cart;
};

// ─── Empty the cart entirely (used after a successful order) ──────────────────
export const clearCart = async () => {
    const { data } = await api.delete(API_ENDPOINTS.CLEAR_CART);
    return data.data.cart;
};