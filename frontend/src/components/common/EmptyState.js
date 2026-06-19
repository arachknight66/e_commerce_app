import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";
import { theme } from "../../styles/theme";

export default function EmptyState({
    icon = "cube-outline",
    title = "Nothing here yet",
    subtitle = "",
    actionLabel = "",
    onAction = null,
}) {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrap}>
                <Ionicons name={icon} size={44} color={theme.colors.muted} />
            </View>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            {actionLabel && onAction ? (
                <View style={styles.action}>
                    <Button title={actionLabel} onPress={onAction} size="md" fullWidth={false} />
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.xxl,
        gap: theme.spacing.sm,
    },
    iconWrap: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.border,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing.sm,
    },
    title: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.dark,
        textAlign: "center",
    },
    subtitle: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.muted,
        textAlign: "center",
        lineHeight: 20,
    },
    action: {
        marginTop: theme.spacing.md,
    },
});