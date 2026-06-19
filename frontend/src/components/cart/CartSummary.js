import { View, Text, StyleSheet } from "react-native";
import Button from "../common/Button";
import { theme } from "../../styles/theme";
import { formatPrice } from "../../utils/formatters";

export default function CartSummary({ totalPrice, totalItems, onCheckout, loading }) {
    const shipping = totalPrice > 50 ? 0 : 4.99;
    const tax = totalPrice * 0.08;
    const grandTotal = totalPrice + shipping + tax;

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Order Summary</Text>

            <View style={styles.rows}>
                <Row label={`Items (${totalItems})`} value={formatPrice(totalPrice)} />
                <Row
                    label="Shipping"
                    value={shipping === 0 ? "Free" : formatPrice(shipping)}
                    valueColor={shipping === 0 ? theme.colors.success : undefined}
                />
                <Row label="Tax (8%)" value={formatPrice(tax)} />
                <View style={styles.divider} />
                <Row
                    label="Total"
                    value={formatPrice(grandTotal)}
                    bold
                />
            </View>

            {totalPrice > 50 ? (
                <View style={styles.freeBadge}>
                    <Text style={styles.freeText}>🎉 You qualify for free shipping!</Text>
                </View>
            ) : (
                <View style={styles.freeBadge}>
                    <Text style={styles.freeText}>
                        Add {formatPrice(50 - totalPrice)} more for free shipping
                    </Text>
                </View>
            )}

            <Button
                title="Proceed to Checkout"
                onPress={onCheckout}
                loading={loading}
                icon="arrow-forward"
                iconPosition="right"
            />
        </View>
    );
}

function Row({ label, value, bold, valueColor }) {
    return (
        <View style={styles.row}>
            <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
            <Text style={[styles.rowValue, bold && styles.bold, valueColor && { color: valueColor }]}>
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.md,
        gap: theme.spacing.md,
        ...theme.shadow.sm,
    },
    heading: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
    },
    rows: {
        gap: theme.spacing.sm - 2,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 2,
    },
    rowLabel: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
    },
    rowValue: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.dark,
        fontWeight: theme.fontWeight.medium,
    },
    bold: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
    },
    freeBadge: {
        backgroundColor: "#F0FFF4",
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        alignItems: "center",
    },
    freeText: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.success,
        fontWeight: theme.fontWeight.semibold,
        textAlign: "center",
    },
});