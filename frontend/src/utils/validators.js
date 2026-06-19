// ─── Email validator ──────────────────────────────────────────────────────────
export const validateEmail = (email) => {
    if (!email) return "Email is required";
    const regex = /^\S+@\S+\.\S+$/;
    if (!regex.test(email)) return "Please enter a valid email";
    return null;
};

// ─── Password validator ───────────────────────────────────────────────────────
export const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
};

// ─── Name validator ───────────────────────────────────────────────────────────
export const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return null;
};

// ─── Confirm password validator ───────────────────────────────────────────────
export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
};

// ─── Shipping address validator ───────────────────────────────────────────────
export const validateShippingAddress = (address) => {
    const errors = {};
    if (!address?.street?.trim()) errors.street = "Street is required";
    if (!address?.city?.trim()) errors.city = "City is required";
    if (!address?.zip?.trim()) errors.zip = "ZIP code is required";
    if (!address?.country?.trim()) errors.country = "Country is required";
    return Object.keys(errors).length > 0 ? errors : null;
};

// ─── Generic required field validator ────────────────────────────────────────
export const validateRequired = (value, fieldName = "This field") => {
    if (!value || !value.toString().trim()) return `${fieldName} is required`;
    return null;
};