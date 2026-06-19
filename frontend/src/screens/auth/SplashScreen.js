import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export default function SplashScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.logoWrap}>
                <View style={styles.iconCircle}>
                    <Ionicons name="bag" size={40} color="#fff" />
                </View>
                <Text style={styles.brand}>Shopify</Text>
                <Text style={styles.tagline}>Premium Shopping Experience</Text>
            </View>
            <ActivityIndicator color={theme.colors.primary} size="small" style={styles.spinner} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: "center",
        justifyContent: "center",
    },
    logoWrap: {
        alignItems: "center",
        gap: theme.spacing.sm,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        ...theme.shadow.lg,
    },
    brand: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.dark,
        letterSpacing: -0.5,
        marginTop: theme.spacing.sm,
    },
    tagline: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
    },
    spinner: {
        position: "absolute",
        bottom: 60,
    },
});