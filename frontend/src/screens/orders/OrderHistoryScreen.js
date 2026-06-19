import { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Pressable,
    RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import * as orderService from "../../services/orderService";
import { formatPrice, formatDate, formatOrderId, capitalize } from "../../utils/formatters";
import { ORDER_STATUS_COLORS } from "../../utils/constants";
import { theme } from "../../styles/theme";

export default function OrderHistoryScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        try {
            setError(null);
            const data = await orderService.getMyOrders();
            setOrders(data || []);
        } catch (e) {
            setError(e.message || "Failed to load orders.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const onRefresh = () => {
        setRefreshing(true);
        load();
    };

    if (loading) return <Loader fullScreen message="Loading orders..." />;
    if (error) return <ErrorMessage message={error} onRetry={load} />;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Orders</Text>
                <Text style={styles.headerCount}>
                    {orders.length} order{orders.length !== 1 ? "s" : ""}
                </Text>
            </View>

            {orders.length === 0 ? (
                <EmptyState
                    icon="receipt-outline"
                    title="No orders yet"
                    subtitle="Your order history will appear here once you place an order."
                    actionLabel="Start Shopping"
                    onAction={() => navigation.navigate("HomeTab")}
                />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.colors.primary}
                        />
                    }
                    renderItem={({ item }) => (
                        <OrderCard order={item} />
                    )}
                />
            )}
        </View>
    );
}

// ─── Order Card ─────────────────────────────────────────────────────────────────

function OrderCard({ order }) {
    const statusColor = ORDER_STATUS_COLORS[order.status] || theme.colors.muted;
    const itemCount = order.items?.length || 0;

    return (
        <View style={styles.card}>
            {/* Top row: Order ID + Status */}
            <View style={styles.cardTopRow}>
                <View style={styles.orderIdWrap}>
                    <Ionicons name="receipt-outline" size={16} color={theme.colors.primary} />
                    <Text style={styles.orderId}>{formatOrderId(order._id)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + "1A" }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {capitalize(order.status || "pending")}
                    </Text>
                </View>
            </View>

            {/* Date */}
            <Text style={styles.date}>{formatDate(order.createdAt)}</Text>

            {/* Items preview */}
            {order.items && order.items.length > 0 && (
                <View style={styles.itemsPreview}>
                    {order.items.slice(0, 3).map((item, idx) => (
                        <View key={item._id || idx} style={styles.itemRow}>
                            <View style={styles.itemDot} />
                            <Text style={styles.itemName} numberOfLines={1}>
                                {item.product?.name || item.name || "Product"}
                            </Text>
                            <Text style={styles.itemQty}>x{item.quantity || 1}</Text>
                        </View>
                    ))}
                    {order.items.length > 3 && (
                        <Text style={styles.moreItems}>
                            +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? "s" : ""}
                        </Text>
                    )}
                </View>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Bottom row: Payment + Total */}
            <View style={styles.cardBottomRow}>
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Ionicons name="cube-outline" size={14} color={theme.colors.muted} />
                        <Text style={styles.metaText}>
                            {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="cash-outline" size={14} color={theme.colors.muted} />
                        <Text style={styles.metaText}>
                            {order.paymentMethod || "COD"}
                        </Text>
                    </View>
                </View>
                <Text style={styles.totalPrice}>
                    {formatPrice(order.totalPrice || order.totalAmount || 0)}
                </Text>
            </View>
        </View>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
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
    list: {
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.xxl,
        gap: theme.spacing.sm,
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
        ...theme.shadow.sm,
    },
    cardTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    orderIdWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
    },
    orderId: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 3,
        borderRadius: theme.borderRadius.full,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.semibold,
    },
    date: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
    },
    itemsPreview: {
        gap: 4,
        paddingLeft: 2,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
    },
    itemDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.border,
    },
    itemName: {
        flex: 1,
        fontSize: theme.fontSize.sm,
        color: theme.colors.dark,
        fontWeight: theme.fontWeight.medium,
    },
    itemQty: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
    },
    moreItems: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
        paddingLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
    },
    cardBottomRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
    },
    totalPrice: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
    },
});