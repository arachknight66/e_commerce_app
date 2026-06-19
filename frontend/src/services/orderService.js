import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

// ─── Place a new order from the current cart ───────────────────────────────────
export const placeOrder = async ({ shippingAddress, paymentMethod = "COD" }) => {
    const { data } = await api.post(API_ENDPOINTS.ORDERS, {
        shippingAddress,
        paymentMethod,
    });
    return data.data.order;
};

// ─── Fetch all orders for the logged-in user ───────────────────────────────────
export const getMyOrders = async () => {
    const { data } = await api.get(API_ENDPOINTS.ORDERS);
    return data.data.orders;
};

// ─── Fetch a single order by ID ────────────────────────────────────────────────
export const getOrderById = async (id) => {
    const { data } = await api.get(API_ENDPOINTS.ORDER_BY_ID(id));
    return data.data.order;
};

// ─── Cancel a pending or processing order ─────────────────────────────────────
export const cancelOrder = async (id) => {
    const { data } = await api.patch(API_ENDPOINTS.CANCEL_ORDER(id));
    return data.data.order;
};