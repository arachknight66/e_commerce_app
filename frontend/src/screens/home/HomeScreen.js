import { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    Pressable,
    StyleSheet,
    RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import BannerCarousel from "../../components/home/BannerCarousel";
import SectionHeader from "../../components/home/SectionHeader";
import CategoryRow from "../../components/home/CategoryRow";
import ProductCard from "../../components/product/ProductCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import * as productService from "../../services/productService";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../styles/theme";
import { getInitials } from "../../utils/formatters";

export default function HomeScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const [featured, setFeatured] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        try {
            setError(null);
            const [featuredData, productsData] = await Promise.all([
                productService.getFeaturedProducts(),
                productService.getProducts({ limit: 20 }),
            ]);
            setFeatured(featuredData);
            setProducts(productsData.products);
        } catch (e) {
            setError(e.message || "Failed to load products.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const onRefresh = () => { setRefreshing(true); load(); };

    const goToProduct = (product) =>
        navigation.navigate("ProductDetail", { productId: product._id });

    const goToListing = (category) =>
        navigation.navigate("ProductListing", category ? { category } : {});

    const goToSearch = () => navigation.navigate("ProductListing", { autoFocus: true });

    if (loading) return <Loader fullScreen message="Loading..." />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    const firstName = user?.name?.split(" ")[0] || "there";

    return (
        <ScrollView
            style={styles.flex}
            contentContainerStyle={{ paddingBottom: insets.bottom + theme.spacing.lg }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        >
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}>
                <View>
                    <Text style={styles.greeting}>Hello, {firstName}</Text>
                    <Text style={styles.subGreeting}>Discover something new today</Text>
                </View>
                <Pressable
                    style={styles.avatar}
                    onPress={() => navigation.navigate("ProfileTab")}
                >
                    <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                </Pressable>
            </View>

            {/* Search bar (tappable → navigates to listing) */}
            <Pressable onPress={goToSearch} style={styles.searchBar}>
                <Ionicons name="search-outline" size={18} color={theme.colors.muted} />
                <Text style={styles.searchPlaceholder}>Search products...</Text>
            </Pressable>

            {/* Featured banner */}
            {featured.length > 0 && (
                <View style={styles.section}>
                    <SectionHeader
                        title="Featured"
                        actionLabel="See all"
                        onAction={() => goToListing(null)}
                    />
                    <BannerCarousel products={featured} onPress={goToProduct} />
                </View>
            )}

            {/* Categories */}
            <View style={[styles.section, { gap: theme.spacing.sm }]}>
                <SectionHeader title="Categories" />
                <CategoryRow
                    selectedCategory="all"
                    onSelect={(cat) => goToListing(cat === "all" ? null : cat)}
                />
            </View>

            {/* Popular products */}
            {products.length > 0 && (
                <View style={styles.section}>
                    <SectionHeader
                        title="Popular Products"
                        actionLabel="View all"
                        onAction={() => goToListing(null)}
                    />
                    <View style={styles.grid}>
                        {products.map((p) => (
                            <ProductCard
                                key={p._id}
                                product={p}
                                onPress={() => goToProduct(p)}
                                style={styles.gridCard}
                            />
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.white,
    },
    greeting: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.dark,
        letterSpacing: -0.3,
    },
    subGreeting: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.muted,
        marginTop: 2,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "#fff",
        fontWeight: theme.fontWeight.bold,
        fontSize: theme.fontSize.sm,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.white,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.full,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm + 2,
        marginHorizontal: theme.spacing.md,
        marginVertical: theme.spacing.md,
        ...theme.shadow.sm,
    },
    searchPlaceholder: {
        fontSize: theme.fontSize.md,
        color: theme.colors.muted,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    gridCard: {
        width: "47%",
    },
});