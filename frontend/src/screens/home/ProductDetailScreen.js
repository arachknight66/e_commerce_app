import { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
    Dimensions,
    FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Button from "../../components/common/Button";
import RatingStars from "../../components/product/RatingStars";
import ProductBadge from "../../components/product/ProductBadge";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import * as productService from "../../services/productService";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";
import { formatPrice } from "../../utils/formatters";
import { theme } from "../../styles/theme";

const { width } = Dimensions.get("window");
const PLACEHOLDER = "https://via.placeholder.com/600x600?text=Product";

export default function ProductDetailScreen({ navigation, route }) {
    const { productId } = route.params;
    const insets = useSafeAreaInsets();

    const { addItem } = useCart();
    const { success: toastSuccess, error: toastError } = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [qty, setQty] = useState(1);

    const load = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const data = await productService.getProductById(productId);
            setProduct(data);
        } catch (e) {
            setError(e.message || "Failed to load product.");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => { load(); }, [load]);

    const handleAddToCart = async () => {
        if (!product || product.stock === 0) return;
        setAddingToCart(true);
        try {
            await addItem(product._id, qty);
            toastSuccess(`${product.name} added to cart!`);
        } catch (e) {
            toastError(e.message || "Could not add to cart.");
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return <Loader fullScreen />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;
    if (!product) return null;

    const images = product.images?.length ? product.images : [PLACEHOLDER];
    const outOfStock = product.stock === 0;
    const maxQty = Math.min(product.stock, 10);

    return (
        <View style={styles.flex}>
            {/* Back + Cart buttons floating over image */}
            <View style={[styles.floatingNav, { top: insets.top + theme.spacing.sm }]}>
                <Pressable onPress={() => navigation.goBack()} style={styles.floatBtn}>
                    <Ionicons name="chevron-back" size={22} color={theme.colors.dark} />
                </Pressable>
                <Pressable
                    onPress={() => navigation.navigate("CartTab")}
                    style={styles.floatBtn}
                >
                    <Ionicons name="bag-outline" size={22} color={theme.colors.dark} />
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image carousel */}
                <View style={styles.imageWrap}>
                    <FlatList
                        data={images}
                        keyExtractor={(_, i) => String(i)}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width));
                        }}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item }}
                                style={styles.image}
                                contentFit="cover"
                                transition={200}
                            />
                        )}
                    />
                    {images.length > 1 && (
                        <View style={styles.dots}>
                            {images.map((_, i) => (
                                <View
                                    key={i}
                                    style={[styles.dot, i === activeImage && styles.dotActive]}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Product info */}
                <View style={styles.content}>
                    <View style={styles.badgeRow}>
                        {product.category ? (
                            <ProductBadge label={product.category} type="featured" />
                        ) : null}
                        {outOfStock ? <ProductBadge label="Out of Stock" type="out-of-stock" /> : null}
                    </View>

                    {product.brand ? (
                        <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>
                    ) : null}
                    <Text style={styles.name}>{product.name}</Text>

                    <View style={styles.ratingRow}>
                        <RatingStars rating={product.rating} numReviews={product.numReviews} />
                    </View>

                    <Text style={styles.price}>{formatPrice(product.price)}</Text>

                    {product.description ? (
                        <View style={styles.descWrap}>
                            <Text style={styles.descLabel}>About this product</Text>
                            <Text style={styles.desc}>{product.description}</Text>
                        </View>
                    ) : null}

                    {/* Stock info */}
                    <View style={styles.stockRow}>
                        <View
                            style={[
                                styles.stockDot,
                                { backgroundColor: outOfStock ? theme.colors.danger : theme.colors.success },
                            ]}
                        />
                        <Text style={styles.stockText}>
                            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
                        </Text>
                    </View>

                    {/* Quantity picker */}
                    {!outOfStock && (
                        <View style={styles.qtyWrap}>
                            <Text style={styles.qtyLabel}>Quantity</Text>
                            <View style={styles.qtyRow}>
                                <Pressable
                                    onPress={() => setQty((q) => Math.max(1, q - 1))}
                                    style={[styles.qtyBtn, qty <= 1 && styles.qtyBtnDisabled]}
                                >
                                    <Ionicons
                                        name="remove"
                                        size={18}
                                        color={qty <= 1 ? theme.colors.border : theme.colors.dark}
                                    />
                                </Pressable>
                                <Text style={styles.qtyNum}>{qty}</Text>
                                <Pressable
                                    onPress={() => setQty((q) => Math.min(maxQty, q + 1))}
                                    style={[styles.qtyBtn, qty >= maxQty && styles.qtyBtnDisabled]}
                                >
                                    <Ionicons
                                        name="add"
                                        size={18}
                                        color={qty >= maxQty ? theme.colors.border : theme.colors.dark}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + theme.spacing.sm }]}>
                <View style={styles.priceSmall}>
                    <Text style={styles.priceSmallLabel}>Total</Text>
                    <Text style={styles.priceSmallVal}>{formatPrice(product.price * qty)}</Text>
                </View>
                <View style={styles.ctaBtn}>
                    <Button
                        title={outOfStock ? "Out of Stock" : "Add to Cart"}
                        onPress={handleAddToCart}
                        loading={addingToCart}
                        disabled={outOfStock}
                        icon="bag-add-outline"
                        iconPosition="left"
                        size="md"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.colors.background },
    floatingNav: {
        position: "absolute",
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.md,
        zIndex: 10,
    },
    floatBtn: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.full,
        backgroundColor: "rgba(255,255,255,0.92)",
        alignItems: "center",
        justifyContent: "center",
        ...theme.shadow.sm,
    },
    imageWrap: {
        backgroundColor: theme.colors.light,
    },
    image: {
        width,
        height: width * 0.85,
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
        paddingVertical: theme.spacing.sm,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.border,
    },
    dotActive: {
        backgroundColor: theme.colors.primary,
        width: 18,
    },
    content: {
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    badgeRow: {
        flexDirection: "row",
        gap: theme.spacing.xs,
    },
    brand: {
        fontSize: 10,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.muted,
        letterSpacing: 1,
        marginTop: 4,
    },
    name: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.dark,
        lineHeight: 28,
        letterSpacing: -0.3,
    },
    ratingRow: {
        marginVertical: 2,
    },
    price: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.primary,
        letterSpacing: -0.5,
    },
    descWrap: { gap: 6 },
    descLabel: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
    },
    desc: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.muted,
        lineHeight: 22,
    },
    stockRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
    },
    stockDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    stockText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.muted,
    },
    qtyWrap: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm + 2,
        ...theme.shadow.sm,
    },
    qtyLabel: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.dark,
    },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
    },
    qtyBtn: {
        width: 34,
        height: 34,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.light,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    qtyBtnDisabled: {
        opacity: 0.4,
    },
    qtyNum: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
        minWidth: 28,
        textAlign: "center",
    },
    bottomBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        gap: theme.spacing.md,
        ...theme.shadow.md,
    },
    priceSmall: { gap: 2 },
    priceSmallLabel: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
    },
    priceSmallVal: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.dark,
    },
    ctaBtn: { flex: 1 },
});