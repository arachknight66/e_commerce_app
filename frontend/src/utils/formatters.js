// ─── Price formatter ──────────────────────────────────────────────────────────
export const formatPrice = (amount) => {
    if (amount === null || amount === undefined) return "$0.00";
    return `$${Number(amount).toFixed(2)}`;
};

// ─── Date formatter ───────────────────────────────────────────────────────────
export const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

// ─── Date + Time formatter ────────────────────────────────────────────────────
export const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// ─── Truncate long text ───────────────────────────────────────────────────────
export const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength).trim()}...`;
};

// ─── Get initials from name (for avatar placeholder) ─────────────────────────
export const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ─── Capitalize first letter ──────────────────────────────────────────────────
export const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// ─── Format order ID for display ─────────────────────────────────────────────
export const formatOrderId = (id) => {
    if (!id) return "";
    return `#${id.toString().slice(-8).toUpperCase()}`;
};

// ─── Calculate discount percentage ───────────────────────────────────────────
export const getDiscountPercent = (original, discounted) => {
    if (!original || !discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
};