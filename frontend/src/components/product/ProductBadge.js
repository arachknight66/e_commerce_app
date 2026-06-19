import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

const BADGE_STYLES = {
    featured: { bg: "#EBF4FF", text: "#3182CE" },
    "out-of-stock": { bg: "#FFF5F5", text: theme.colors.danger },
    sale: { bg: "#F0FFF4", text: theme.colors.success },
    new: { bg: "#FAF5FF", text: "#805AD5" },
};

export default function ProductBadge({ label, type = "featured" }) {
    const style = BADGE_STYLES[type] || BADGE_STYLES.featured;
    return (
        <View style={[styles.badge, { backgroundColor: style.bg }]}>
            <Text style={[styles.label, { color: style.text }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: theme.borderRadius.full,
        alignSelf: "flex-start",
    },
    label: {
        fontSize: 10,
        fontWeight: theme.fontWeight.bold,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});