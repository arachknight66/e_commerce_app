import { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToast } from "../../hooks/useToast";
import { theme } from "../../styles/theme";

const TOAST_CONFIG = {
    success: { icon: "checkmark-circle", color: theme.colors.success },
    error: { icon: "close-circle", color: theme.colors.danger },
    info: { icon: "information-circle", color: theme.colors.primary },
    default: { icon: "information-circle", color: theme.colors.dark },
};

export default function Toast() {
    const { toast } = useToast();
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(-80)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (toast) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    speed: 18,
                    bounciness: 4,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -80,
                    duration: 180,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [toast]);

    if (!toast) return null;

    const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.default;

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.container,
                {
                    top: insets.top + theme.spacing.sm,
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            <Ionicons name={config.icon} size={18} color={config.color} />
            <Text style={styles.message} numberOfLines={2}>
                {toast.message}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: theme.spacing.md,
        right: theme.spacing.md,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.sm + 2,
        paddingHorizontal: theme.spacing.md,
        ...theme.shadow.md,
        zIndex: 999,
    },
    message: {
        flex: 1,
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.dark,
    },
});