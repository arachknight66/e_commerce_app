import { useState, useEffect, useCallback, useRef } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Pressable,
    Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import ProductCard from "../../components/product/ProductCard";
import CategoryRow from "../../components/home/CategoryRow";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";

import * as productService from "../../services/productService";
import { theme } from "../../styles/theme";

const LIMIT = 10;

export default function ProductListingScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { category: initialCategory, autoFocus } = route.params || {};

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(initialCategory || "all");
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const searchInputRef = useRef(null);
    const debounceRef = useRef(null);

    const fetchProducts = useCallback(async (searchVal, catVal, pageNum, append = false) => {
        try {
            setError(null);
            if (!append) setLoading(true);
            else setLoadingMore(true);

            const params = {
                page: pageNum,
                limit: LIMIT,
            };
            if (searchVal.trim()) params.search = searchVal.trim();
            if (catVal && catVal !== "all") params.category = catVal;

            const result = await productService.getProducts(params);
            const newProducts = result.products || [];

            setProducts((prev) => (append ? [...prev, ...newProducts] : newProducts));
            setHasMore(result.pagination?.hasMore ?? false);
        } catch (e) {
            setError(e.message || "Failed to load products.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Initial load and re-load when category changes
    useEffect(() => {
        setPage(1);
        fetchProducts(search, category, 1, false);
    }, [category]);

    // Auto-focus search if requested
    useEffect(() => {
        if (autoFocus) {
            setTimeout(() => searchInputRef.current?.focus(), 400);
        }
    }, []);

    const handleSearchChange = (val) => {
        setSearch(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            fetchProducts(val, category, 1, false);
        }, 400);
    };

    const handleCategorySelect = (cat) => {
        setCategory(cat);
    };

    const handleEndReached = () => {
        if (!hasMore || loadingMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(search, category, nextPage, true);
    };

    const goToProduct = (product) =>
        navigation.navigate("ProductDetail", { productId: product._id });

    const numColumns = 2;

    return (
        <View style={[styles.flex, { paddingTop: insets.top }]}>
            {/* Top bar */}
            <View style={styles.topBar}>
                <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.dark} />
                </Pressable>
                <View style={styles.searchRow}>
                    <Ionicons name="search-outline" size={18} color={theme.colors.muted} style={styles.searchIcon} />
                    <TextInput
                        ref={searchInputRef}
                        style={styles.searchInput}
                        value={search}
                        onChangeText={handleSearchChange}
                        placeholder="Search products…"
                        placeholderTextColor={theme.colors.muted}
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                    />
                    {search.length > 0 && (
                        <Pressable onPress={() => { setSearch(""); fetchProducts("", category, 1, false); }}>
                            <Ionicons name="close-circle" size={18} color={theme.colors.muted} />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* Category filter */}
            <View style={styles.categoryWrap}>
                <CategoryRow selectedCategory={category} onSelect={handleCategorySelect} />
            </View>

            {loading ? (
                <Loader fullScreen message="Finding products…" />
            ) : error ? (
                <ErrorMessage message={error} onRetry={() => fetchProducts(search, category, 1, false)} />
            ) : products.length === 0 ? (
                <EmptyState
                    icon="search-outline"
                    title="No products found"
                    subtitle="Try a different search term or category."
                    actionLabel="Clear search"
                    onAction={() => { setSearch(""); setCategory("all"); fetchProducts("", "all", 1, false); }}
                />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    numColumns={numColumns}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator
                                color={theme.colors.primary}
                                style={{ marginVertical: theme.spacing.md }}
                            />
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            onPress={() => goToProduct(item)}
                            style={styles.card}
                        />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.colors.background },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        gap: theme.spacing.sm,
    },
    backBtn: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    searchRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.light,
        borderRadius: theme.borderRadius.full,
        paddingHorizontal: theme.spacing.sm + 2,
        height: 40,
        gap: theme.spacing.xs,
    },
    searchIcon: { marginRight: 2 },
    searchInput: {
        flex: 1,
        fontSize: theme.fontSize.md,
        color: theme.colors.dark,
    },
    categoryWrap: {
        backgroundColor: theme.colors.white,
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    list: {
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.xxl,
    },
    row: {
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },
    card: {
        flex: 1,
    },
});