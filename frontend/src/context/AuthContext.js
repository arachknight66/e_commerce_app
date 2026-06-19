import { createContext, useState, useEffect, useCallback } from "react";

import * as authService from "../services/authService";
import { setUnauthorizedHandler } from "../services/api";
import { STORAGE_KEYS } from "../utils/constants";
import { storeData, getData, removeMultiple } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    // Starts true: AppNavigator shows the splash screen until we've checked
    // AsyncStorage for a saved session, so we never flash the login screen
    // first on a cold start where the user is actually already signed in.
    const [isLoading, setIsLoading] = useState(true);

    // ── Clear local session state (used by logout and by 401 responses) ────────
    const clearSession = useCallback(async () => {
        await removeMultiple([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
        setUser(null);
        setToken(null);
    }, []);

    // ── Restore a saved session on cold start ───────────────────────────────────
    useEffect(() => {
        (async () => {
            const [savedToken, savedUser] = await Promise.all([
                getData(STORAGE_KEYS.TOKEN),
                getData(STORAGE_KEYS.USER),
            ]);
            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(savedUser);
            }
            setIsLoading(false);
        })();
    }, []);

    // ── Let api.js force-logout this context when the server returns a 401,
    // e.g. an expired token — without api.js importing this context directly. ──
    useEffect(() => {
        setUnauthorizedHandler(() => clearSession());
        return () => setUnauthorizedHandler(null);
    }, [clearSession]);

    const login = useCallback(async (email, password) => {
        const { token: newToken, user: newUser } = await authService.login({ email, password });
        await Promise.all([
            storeData(STORAGE_KEYS.TOKEN, newToken),
            storeData(STORAGE_KEYS.USER, newUser),
        ]);
        setToken(newToken);
        setUser(newUser);
        return newUser;
    }, []);

    const register = useCallback(async (name, email, password) => {
        const { token: newToken, user: newUser } = await authService.register({
            name,
            email,
            password,
        });
        await Promise.all([
            storeData(STORAGE_KEYS.TOKEN, newToken),
            storeData(STORAGE_KEYS.USER, newUser),
        ]);
        setToken(newToken);
        setUser(newUser);
        return newUser;
    }, []);

    const logout = useCallback(async () => {
        await clearSession();
    }, [clearSession]);

    const updateProfile = useCallback(async (updates) => {
        const updatedUser = await authService.updateProfile(updates);
        await storeData(STORAGE_KEYS.USER, updatedUser);
        setUser(updatedUser);
        return updatedUser;
    }, []);

    const forgotPassword = useCallback(async (email) => {
        return authService.forgotPassword(email);
    }, []);

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}