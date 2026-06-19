import { Pressable, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import RatingStars from "./RatingStars";
import { theme } from "../../styles/theme";
import { formatPrice, truncateText } from "../../utils/formatters";

const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

export default function ProductCard({ product, onPress, style }) {
    const image = product.images?.[0] || PLACEHOLDER;
    const outOfStock = product.stock === 0;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed, style]}
        >
            <View style={styles.imageWrap}>
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
                {outOfStock && (
                    <View style={styles.outOfStockOverlay}>
                        <Text style={styles.outOfStockText}>Out of stock</Text>
                    </View>
                )}
                {product.isFeatured && !outOfStock && (
                    <View style={styles.featuredBadge}>
                        <Text style={styles.featuredText}>Featured</Text>
                    </View>
                )}
            </View>

            <View style={styles.info}>
                {product.brand ? (
                    <Text style={styles.brand} numberOfLines={1}>
                        {product.brand.toUpperCase()}
                    </Text>
                ) : null}
                <Text style={styles.name} numberOfLines={2}>
                    {truncateText(product.name, 50)}
                </Text>
                <View style={styles.footer}>
                    <RatingStars rating={product.rating} size={12} showCount={false} />
                    <Text style={styles.price}>{formatPrice(product.price)}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        overflow: "hidden",
        ...theme.shadow.sm,
    },
    cardPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.98 }],
    },
    imageWrap: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: theme.colors.light,
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    outOfStockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
    },
    outOfStockText: {
        color: "#fff",
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.bold,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    featuredBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.full,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    featuredText: {
        fontSize: 9,
        fontWeight: theme.fontWeight.bold,
        color: "#fff",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    info: {
        padding: theme.spacing.sm + 2,
        gap: 4,
    },
    brand: {
        fontSize: 9,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.muted,
        letterSpacing: 0.8,
    },
    name: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.dark,
        lineHeight: 18,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 2,
    },
    price: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
});