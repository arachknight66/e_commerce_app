import { createContext, useState, useCallback, useRef } from "react";

export const ToastContext = createContext(null);

const DEFAULT_DURATION = 2800;

export function ToastProvider({ children }) {
    // Single active toast rather than a queue — keeps the UI calm; a second
    // toast firing while one is visible simply replaces it instead of stacking.
    const [toast, setToast] = useState(null); // { id, message, type }
    const timeoutRef = useRef(null);

    const hide = useCallback(() => {
        setToast(null);
    }, []);

    const show = useCallback((message, type = "default", duration = DEFAULT_DURATION) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const id = Date.now();
        setToast({ id, message, type });

        timeoutRef.current = setTimeout(() => {
            // Guard against a newer toast having already replaced this one.
            setToast((current) => (current?.id === id ? null : current));
        }, duration);
    }, []);

    const success = useCallback((message, duration) => show(message, "success", duration), [show]);
    const error = useCallback((message, duration) => show(message, "error", duration), [show]);
    const info = useCallback((message, duration) => show(message, "info", duration), [show]);

    const value = { toast, show, hide, success, error, info };

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}