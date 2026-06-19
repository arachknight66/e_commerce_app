import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export default function Loader({ message = "Loading…", size = "large", fullScreen = false }) {
    if (fullScreen) {
        return (
            <View style={styles.fullScreen}>
                <ActivityIndicator size={size} color={theme.colors.primary} />
                {message ? <Text style={styles.message}>{message}</Text> : null}
            </View>
        );
    }

    return (
        <View style={styles.inline}>
            <ActivityIndicator size={size} color={theme.colors.primary} />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
        gap: theme.spacing.sm,
    },
    inline: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: theme.spacing.xl,
        gap: theme.spacing.sm,
    },
    message: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
    },
});