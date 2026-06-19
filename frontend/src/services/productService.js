import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

// ─── Fetch paginated product list with optional filters ────────────────────────
export const getProducts = async (params = {}) => {
    const { data } = await api.get(API_ENDPOINTS.PRODUCTS, { params });
    return data.data; // { products, pagination }
};

// ─── Fetch featured products for home screen hero ──────────────────────────────
export const getFeaturedProducts = async () => {
    const { data } = await api.get(API_ENDPOINTS.FEATURED_PRODUCTS);
    return data.data.products;
};

// ─── Fetch all unique product categories ──────────────────────────────────────
export const getCategories = async () => {
    const { data } = await api.get(API_ENDPOINTS.CATEGORIES);
    return data.data.categories;
};

// ─── Fetch a single product by its ID ─────────────────────────────────────────
export const getProductById = async (id) => {
    const { data } = await api.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return data.data.product;
};