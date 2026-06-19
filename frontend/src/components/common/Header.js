import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../styles/theme";

export default function Header({
    title,
    onBack,
    rightIcon,
    onRightPress,
    rightLabel,
    transparent = false,
}) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                { paddingTop: insets.top + theme.spacing.sm },
                transparent && styles.transparent,
            ]}
        >
            <View style={styles.row}>
                {onBack ? (
                    <Pressable onPress={onBack} style={styles.iconBtn} hitSlop={8}>
                        <Ionicons name="chevron-back" size={24} color={theme.colors.dark} />
                    </Pressable>
                ) : (
                    <View style={styles.iconBtn} />
                )}

                {title ? (
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                ) : null}

                {rightIcon || rightLabel ? (
                    <Pressable onPress={onRightPress} style={styles.iconBtn} hitSlop={8}>
                        {rightIcon ? (
                            <Ionicons name={rightIcon} size={22} color={theme.colors.dark} />
                        ) : (
                            <Text style={styles.rightLabel}>{rightLabel}</Text>
                        )}
                    </Pressable>
                ) : (
                    <View style={styles.iconBtn} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    transparent: {
        backgroundColor: "transparent",
        borderBottomWidth: 0,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    iconBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        flex: 1,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.dark,
        textAlign: "center",
    },
    rightLabel: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
    },
});