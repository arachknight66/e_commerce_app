import { View, Text, Pressable, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export default function SectionHeader({ title, actionLabel, onAction }) {
    return (
        <View style={styles.row}>
            <Text style={styles.title}>{title}</Text>
            {actionLabel && onAction ? (
                <Pressable onPress={onAction} hitSlop={8}>
                    <Text style={styles.action}>{actionLabel}</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    title: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
    },
    action: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
    },
});