import { View, Text, StyleSheet } from "react-native";
import Button from "../common/Button";
import { theme } from "../../styles/theme";
import { formatPrice } from "../../utils/formatters";

export default function CartSummary({ totalPrice, totalItems, onCheckout, loading }) {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Order Summary</Text>

            <View style={styles.rows}>
                <Row label={`Items (${totalItems})`} value={formatPrice(totalPrice)} />
                <View style={styles.divider} />
                <Row
                    label="Total"
                    value={formatPrice(totalPrice)}
                    bold
                />
            </View>

            <View style={styles.codBadge}>
                <Text style={styles.codText}>Cash on Delivery</Text>
            </View>

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
    codBadge: {
        backgroundColor: "#F0FFF4",
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        alignItems: "center",
    },
    codText: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.success,
        fontWeight: theme.fontWeight.semibold,
        textAlign: "center",
    },
});