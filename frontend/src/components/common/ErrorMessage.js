import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";
import { theme } from "../../styles/theme";

export default function ErrorMessage({
    message = "Something went wrong.",
    onRetry = null,
    retryLabel = "Try again",
}) {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrap}>
                <Ionicons name="warning-outline" size={36} color={theme.colors.danger} />
            </View>
            <Text style={styles.message}>{message}</Text>
            {onRetry ? (
                <View style={styles.action}>
                    <Button
                        title={retryLabel}
                        onPress={onRetry}
                        size="md"
                        variant="outline"
                        fullWidth={false}
                    />
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
        width: 72,
        height: 72,
        borderRadius: theme.borderRadius.full,
        backgroundColor: "#FFF5F5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing.xs,
    },
    message: {
        fontSize: theme.fontSize.md,
        color: theme.colors.dark,
        textAlign: "center",
        lineHeight: 22,
    },
    action: {
        marginTop: theme.spacing.md,
    },
});