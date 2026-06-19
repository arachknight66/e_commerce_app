import axios from "axios";

import { STORAGE_KEYS } from "../utils/constants";
import { getData, removeMultiple } from "../utils/storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
    console.warn(
        "⚠️  EXPO_PUBLIC_API_URL is not set — check your .env file. Falling back to localhost."
    );
}

export const api = axios.create({
    baseURL: API_URL || "http://localhost:5000/api",
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
});

// ─── Attach the saved auth token to every outgoing request ───────────────────
api.interceptors.request.use(
    async (config) => {
        const token = await getData(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Lets AuthContext react to a session invalidated server-side (expired /
// revoked token) without api.js importing the context directly, which would
// create a circular dependency. AuthContext registers itself on mount. ────────
let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler;
};

// ─── Normalize every error into one shape — { status, message } — so screens
// never have to dig through error.response.data themselves, and clear stale
// credentials the moment the server says the session is no longer valid. ──────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const message =
            error.response?.data?.message ||
            (error.code === "ECONNABORTED"
                ? "Request timed out — please try again"
                : "Something went wrong. Please check your connection.");

        if (status === 401) {
            await removeMultiple([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
            onUnauthorized?.();
        }

        return Promise.reject({ status, message, original: error });
    }
);

export default api;