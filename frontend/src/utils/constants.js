export const STORAGE_KEYS = {
    TOKEN: "@ecom_token",
    USER: "@ecom_user",
};

export const API_ENDPOINTS = {
    // Auth
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    ME: "/auth/me",
    UPDATE_PROFILE: "/auth/profile",

    // Products
    PRODUCTS: "/products",
    FEATURED_PRODUCTS: "/products/featured",
    CATEGORIES: "/products/categories",
    PRODUCT_BY_ID: (id) => `/products/${id}`,

    // Cart
    CART: "/cart",
    ADD_TO_CART: "/cart/add",
    UPDATE_CART_ITEM: (itemId) => `/cart/update/${itemId}`,
    REMOVE_CART_ITEM: (itemId) => `/cart/remove/${itemId}`,
    CLEAR_CART: "/cart/clear",

    // Orders
    ORDERS: "/orders",
    ORDER_BY_ID: (id) => `/orders/${id}`,
    CANCEL_ORDER: (id) => `/orders/${id}/cancel`,
};

export const CATEGORIES = [
    { id: "all", label: "All", icon: "apps" },
    { id: "Electronics", label: "Electronics", icon: "phone-portrait" },
    { id: "Clothing", label: "Clothing", icon: "shirt" },
    { id: "Footwear", label: "Footwear", icon: "footsteps" },
    { id: "Books", label: "Books", icon: "book" },
    { id: "Home", label: "Home", icon: "home" },
    { id: "Sports", label: "Sports", icon: "football" },
];

export const ORDER_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
};

export const ORDER_STATUS_COLORS = {
    pending: "#ECC94B",
    processing: "#6C63FF",
    shipped: "#4299E1",
    delivered: "#48BB78",
    cancelled: "#FC8181",
};

export const PAYMENT_METHODS = [
    { id: "COD", label: "Cash on Delivery", icon: "cash" },
    { id: "Card", label: "Credit / Debit Card", icon: "card" },
    { id: "UPI", label: "UPI", icon: "phone-portrait" },
];

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
};