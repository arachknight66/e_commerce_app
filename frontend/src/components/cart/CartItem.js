import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { formatPrice, truncateText } from "../../utils/formatters";

const PLACEHOLDER = "https://via.placeholder.com/150x150?text=Item";

export default function CartItem({ item, onRemove, onUpdateQty, loading }) {
    const { product, quantity, price, _id } = item;
    const image = product?.images?.[0] || PLACEHOLDER;
    const maxQty = product?.stock || 99;

    return (
        <View style={styles.card}>
            <Image
                source={{ uri: image }}
                style={styles.image}
                contentFit="cover"
                transition={200}
            />
            <View style={styles.body}>
                <View style={styles.top}>
                    <View style={styles.nameWrap}>
                        {product?.brand ? (
                            <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>
                        ) : null}
                        <Text style={styles.name} numberOfLines={2}>
                            {truncateText(product?.name || "Product", 45)}
                        </Text>
                    </View>
                    <Pressable onPress={() => onRemove(_id)} hitSlop={8} style={styles.removeBtn}>
                        <Ionicons name="close" size={18} color={theme.colors.muted} />
                    </Pressable>
                </View>

                <View style={styles.bottom}>
                    <Text style={styles.price}>{formatPrice(price * quantity)}</Text>

                    {loading ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                        <View style={styles.qtyRow}>
                            <Pressable
                                onPress={() => quantity > 1 && onUpdateQty(_id, quantity - 1)}
                                style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                                hitSlop={6}
                            >
                                <Ionicons
                                    name="remove"
                                    size={16}
                                    color={quantity <= 1 ? theme.colors.border : theme.colors.dark}
                                />
                            </Pressable>
                            <Text style={styles.qty}>{quantity}</Text>
                            <Pressable
                                onPress={() => quantity < maxQty && onUpdateQty(_id, quantity + 1)}
                                style={[styles.qtyBtn, quantity >= maxQty && styles.qtyBtnDisabled]}
                                hitSlop={6}
                            >
                                <Ionicons
                                    name="add"
                                    size={16}
                                    color={quantity >= maxQty ? theme.colors.border : theme.colors.dark}
                                />
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        overflow: "hidden",
        ...theme.shadow.sm,
        marginBottom: theme.spacing.sm,
    },
    image: {
        width: 90,
        height: 90,
        backgroundColor: theme.colors.light,
    },
    body: {
        flex: 1,
        padding: theme.spacing.sm + 2,
        justifyContent: "space-between",
    },
    top: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    nameWrap: {
        flex: 1,
        gap: 2,
    },
    brand: {
        fontSize: 9,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.muted,
        letterSpacing: 0.6,
    },
    name: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.dark,
        lineHeight: 18,
    },
    removeBtn: {
        padding: 4,
        marginLeft: 4,
    },
    bottom: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: theme.spacing.xs,
    },
    price: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.light,
        borderRadius: theme.borderRadius.full,
        padding: 2,
        gap: 2,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.white,
        alignItems: "center",
        justifyContent: "center",
        ...theme.shadow.sm,
    },
    qtyBtnDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    qty: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
        minWidth: 24,
        textAlign: "center",
    },
});