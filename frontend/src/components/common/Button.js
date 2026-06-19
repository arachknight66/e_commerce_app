import { useRef } from "react";
import { Pressable, Animated, Text, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../styles/theme";

const VARIANT_CLASSES = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    outline: "bg-transparent border border-primary",
    ghost: "bg-transparent",
};

const VARIANT_TEXT_CLASSES = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-primary",
    ghost: "text-primary",
};

const VARIANT_ICON_COLOR = {
    primary: theme.colors.white,
    secondary: theme.colors.white,
    outline: theme.colors.primary,
    ghost: theme.colors.primary,
};

const SIZE_CLASSES = {
    md: "py-3 px-5 rounded-2xl",
    lg: "py-4 px-6 rounded-2xl",
};

const SIZE_TEXT_CLASSES = {
    md: "text-base",
    lg: "text-lg",
};

const ICON_SIZE = { md: 18, lg: 20 };

export default function Button({
    title,
    onPress,
    variant = "primary",
    size = "lg",
    icon,
    iconPosition = "left",
    loading = false,
    disabled = false,
    fullWidth = true,
    className = "",
}) {
    const scale = useRef(new Animated.Value(1)).current;
    const isDisabled = disabled || loading;
    const iconColor = VARIANT_ICON_COLOR[variant];

    const animateTo = (toValue) => {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            speed: 40,
            bounciness: 0,
        }).start();
    };

    return (
        <Animated.View
            style={{ transform: [{ scale }], width: fullWidth ? "100%" : undefined }}
        >
            <Pressable
                onPress={onPress}
                disabled={isDisabled}
                onPressIn={() => !isDisabled && animateTo(0.96)}
                onPressOut={() => !isDisabled && animateTo(1)}
                className={[
                    "flex-row items-center justify-center",
                    SIZE_CLASSES[size],
                    VARIANT_CLASSES[variant],
                    isDisabled ? "opacity-50" : "",
                    className,
                ].join(" ")}
            >
                {loading ? (
                    <ActivityIndicator color={iconColor} />
                ) : (
                    <View
                        className="flex-row items-center justify-center"
                        style={{ gap: theme.spacing.xs + 2 }}
                    >
                        {icon && iconPosition === "left" && (
                            <Ionicons name={icon} size={ICON_SIZE[size]} color={iconColor} />
                        )}
                        <Text
                            className={`font-semibold ${SIZE_TEXT_CLASSES[size]} ${VARIANT_TEXT_CLASSES[variant]}`}
                        >
                            {title}
                        </Text>
                        {icon && iconPosition === "right" && (
                            <Ionicons name={icon} size={ICON_SIZE[size]} color={iconColor} />
                        )}
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
}