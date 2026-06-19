import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";
import { theme } from "../../styles/theme";

export default function CartScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { items, totalItems, totalPrice, isLoading, removeItem, updateItem, refresh } = useCart();
    const { success: toastSuccess, error: toastError } = useToast();

    const [actionLoading, setActionLoading] = useState({});

    const handleRemove = async (itemId) => {
        setActionLoading((l) => ({ ...l, [itemId]: true }));
        try {
            await removeItem(itemId);
            toastSuccess("Item removed");
        } catch (e) {
            toastError(e.message || "Could not remove item.");
        } finally {
            setActionLoading((l) => ({ ...l, [itemId]: false }));
        }
    };

    const handleUpdateQty = async (itemId, qty) => {
        setActionLoading((l) => ({ ...l, [itemId]: true }));
        try {
            await updateItem(itemId, qty);
        } catch (e) {
            toastError(e.message || "Could not update quantity.");
        } finally {
            setActionLoading((l) => ({ ...l, [itemId]: false }));
        }
    };

    const handleCheckout = () => {
        navigation.navigate("Checkout");
    };

    if (isLoading) return <Loader fullScreen message="Loading cart…" />;

    return (
        <View style={[styles.flex, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart</Text>
                {totalItems > 0 && (
                    <Text style={styles.headerCount}>{totalItems} item{totalItems !== 1 ? "s" : ""}</Text>
                )}
            </View>

            {items.length === 0 ? (
                <EmptyState
                    icon="bag-outline"
                    title="Your cart is empty"
                    subtitle="Browse products and add them to your cart to get started."
                    actionLabel="Browse Products"
                    onAction={() => navigation.navigate("HomeTab")}
                />
            ) : (
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingBottom: insets.bottom + theme.spacing.lg },
                    ]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={refresh}
                            tintColor={theme.colors.primary}
                        />
                    }
                >
                    <View style={styles.itemsSection}>
                        {items.map((item) => (
                            <CartItem
                                key={item._id}
                                item={item}
                                onRemove={handleRemove}
                                onUpdateQty={handleUpdateQty}
                                loading={!!actionLoading[item._id]}
                            />
                        ))}
                    </View>

                    <CartSummary
                        totalPrice={totalPrice}
                        totalItems={totalItems}
                        onCheckout={handleCheckout}
                    />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.dark,
        letterSpacing: -0.3,
    },
    headerCount: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.muted,
    },
    scrollContent: {
        padding: theme.spacing.md,
        gap: theme.spacing.md,
    },
    itemsSection: {
        gap: theme.spacing.sm,
    },
});