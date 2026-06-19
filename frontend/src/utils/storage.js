import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Store data ───────────────────────────────────────────────────────────────
export const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        return true;
    } catch (error) {
        console.error(`Storage error (set) [${key}]:`, error);
        return false;
    }
};

// ─── Get data ─────────────────────────────────────────────────────────────────
export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error(`Storage error (get) [${key}]:`, error);
        return null;
    }
};

// ─── Remove single key ────────────────────────────────────────────────────────
export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Storage error (remove) [${key}]:`, error);
        return false;
    }
};

// ─── Remove multiple keys ─────────────────────────────────────────────────────
export const removeMultiple = async (keys) => {
    try {
        await AsyncStorage.multiRemove(keys);
        return true;
    } catch (error) {
        console.error("Storage error (multiRemove):", error);
        return false;
    }
};

// ─── Clear all app storage ────────────────────────────────────────────────────
export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error("Storage error (clear):", error);
        return false;
    }
};