import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export default function RatingStars({ rating = 0, numReviews, size = 14, showCount = true }) {
    const filled = Math.floor(rating);
    const half = rating - filled >= 0.5;
    const empty = 5 - filled - (half ? 1 : 0);

    return (
        <View style={styles.row}>
            {Array.from({ length: filled }).map((_, i) => (
                <Ionicons key={`f-${i}`} name="star" size={size} color="#F6AD55" />
            ))}
            {half ? <Ionicons name="star-half" size={size} color="#F6AD55" /> : null}
            {Array.from({ length: empty }).map((_, i) => (
                <Ionicons key={`e-${i}`} name="star-outline" size={size} color="#F6AD55" />
            ))}
            {showCount && numReviews != null ? (
                <Text style={[styles.count, { fontSize: size - 2 }]}>({numReviews})</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    count: {
        color: theme.colors.muted,
        marginLeft: 2,
        fontWeight: theme.fontWeight.medium,
    },
});