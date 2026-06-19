import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

// ─── Register a new account ───────────────────────────────────────────────────
export const register = async ({ name, email, password }) => {
    const { data } = await api.post(API_ENDPOINTS.REGISTER, { name, email, password });
    return data.data; // { token, user }
};

// ─── Log in with email + password ─────────────────────────────────────────────
export const login = async ({ email, password }) => {
    const { data } = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    return data.data; // { token, user }
};

// ─── Request a password reset (backend always returns success, even for an
// email that doesn't exist, to avoid leaking which emails are registered) ─────
export const forgotPassword = async (email) => {
    const { data } = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    return data; // { success, message }
};

// ─── Fetch the logged-in user's profile ───────────────────────────────────────
export const getMe = async () => {
    const { data } = await api.get(API_ENDPOINTS.ME);
    return data.data.user;
};

// ─── Update name / avatar / address ───────────────────────────────────────────
export const updateProfile = async (updates) => {
    const { data } = await api.put(API_ENDPOINTS.UPDATE_PROFILE, updates);
    return data.data.user;
};