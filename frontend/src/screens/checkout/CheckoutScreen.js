import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/common/Header";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import * as orderService from "../../services/orderService";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { validateShippingAddress } from "../../utils/validators";
import { formatPrice } from "../../utils/formatters";
import { PAYMENT_METHODS } from "../../utils/constants";
import { theme } from "../../styles/theme";

export default function CheckoutScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { totalPrice, totalItems, clear } = useCart();
    const { user } = useAuth();
    const { success: toastSuccess, error: toastError } = useToast();

    const [street, setStreet] = useState(user?.address?.street || "");
    const [city, setCity] = useState(user?.address?.city || "");
    const [zip, setZip] = useState(user?.address?.zip || "");
    const [country, setCountry] = useState(user?.address?.country || "");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const shipping = totalPrice > 50 ? 0 : 4.99;
    const tax = totalPrice * 0.08;
    const grandTotal = totalPrice + shipping + tax;

    const handlePlaceOrder = async () => {
        const address = { street, city, zip, country };
        const errs = validateShippingAddress(address);
        if (errs) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        try {
            await orderService.placeOrder({ shippingAddress: address, paymentMethod });
            await clear();
            toastSuccess("Order placed successfully! 🎉");
            navigation.navigate("Main");
            navigation.navigate("OrdersTab");
        } catch (e) {
            toastError(e.message || "Could not place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Header title="Checkout" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: insets.bottom + theme.spacing.xl },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Shipping address */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Shipping Address</Text>
                    </View>
                    <View style={styles.form}>
                        <Input
                            label="Street Address"
                            value={street}
                            onChangeText={(v) => { setStreet(v); setErrors((e) => ({ ...e, street: null })); }}
                            placeholder="123 Main Street"
                            autoCapitalize="words"
                            error={errors.street}
                        />
                        <View style={styles.row}>
                            <View style={styles.half}>
                                <Input
                                    label="City"
                                    value={city}
                                    onChangeText={(v) => { setCity(v); setErrors((e) => ({ ...e, city: null })); }}
                                    placeholder="New York"
                                    autoCapitalize="words"
                                    error={errors.city}
                                />
                            </View>
                            <View style={styles.half}>
                                <Input
                                    label="ZIP Code"
                                    value={zip}
                                    onChangeText={(v) => { setZip(v); setErrors((e) => ({ ...e, zip: null })); }}
                                    placeholder="10001"
                                    keyboardType="numeric"
                                    error={errors.zip}
                                />
                            </View>
                        </View>
                        <Input
                            label="Country"
                            value={country}
                            onChangeText={(v) => { setCountry(v); setErrors((e) => ({ ...e, country: null })); }}
                            placeholder="United States"
                            autoCapitalize="words"
                            error={errors.country}
                        />
                    </View>
                </View>

                {/* Payment method */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="card-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Payment Method</Text>
                    </View>
                    <View style={styles.paymentList}>
                        {PAYMENT_METHODS.map((method) => {
                            const active = paymentMethod === method.id;
                            return (
                                <Pressable
                                    key={method.id}
                                    onPress={() => setPaymentMethod(method.id)}
                                    style={[styles.paymentOption, active && styles.paymentOptionActive]}
                                >
                                    <Ionicons
                                        name={method.icon}
                                        size={20}
                                        color={active ? theme.colors.primary : theme.colors.muted}
                                    />
                                    <Text
                                        style={[
                                            styles.paymentLabel,
                                            active && styles.paymentLabelActive,
                                        ]}
                                    >
                                        {method.label}
                                    </Text>
                                    {active && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={18}
                                            color={theme.colors.primary}
                                            style={styles.check}
                                        />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Order summary */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="receipt-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Order Summary</Text>
                    </View>
                    <View style={styles.summaryRows}>
                        <SummaryRow label={`Items (${totalItems})`} value={formatPrice(totalPrice)} />
                        <SummaryRow
                            label="Shipping"
                            value={shipping === 0 ? "Free" : formatPrice(shipping)}
                            valueColor={shipping === 0 ? theme.colors.success : undefined}
                        />
                        <SummaryRow label="Tax (8%)" value={formatPrice(tax)} />
                        <View style={styles.divider} />
                        <SummaryRow label="Total" value={formatPrice(grandTotal)} bold />
                    </View>
                </View>

                <Button
                    title={`Place Order · ${formatPrice(grandTotal)}`}
                    onPress={handlePlaceOrder}
                    loading={loading}
                    icon="checkmark-circle-outline"
                    iconPosition="right"
                />

                <Text style={styles.disclaimer}>
                    By placing your order you agree to our Terms of Service. All prices include applicable taxes.
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function SummaryRow({ label, value, bold, valueColor }) {
    return (
        <View style={rowStyles.row}>
            <Text style={[rowStyles.label, bold && rowStyles.bold]}>{label}</Text>
            <Text style={[rowStyles.value, bold && rowStyles.bold, valueColor && { color: valueColor }]}>
                {value}
            </Text>
        </View>
    );
}

const rowStyles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
    },
    value: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.dark,
        fontWeight: theme.fontWeight.medium,
    },
    bold: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
    },
});

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.colors.background },
    content: {
        padding: theme.spacing.md,
        gap: theme.spacing.md,
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.md,
        gap: theme.spacing.md,
        ...theme.shadow.sm,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
    },
    cardTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
    },
    form: { gap: theme.spacing.md },
    row: {
        flexDirection: "row",
        gap: theme.spacing.sm,
    },
    half: { flex: 1 },
    paymentList: { gap: theme.spacing.sm },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        padding: theme.spacing.sm + 2,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
    },
    paymentOptionActive: {
        borderColor: theme.colors.primary,
        backgroundColor: "#F5F3FF",
    },
    paymentLabel: {
        flex: 1,
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.muted,
    },
    paymentLabelActive: {
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.semibold,
    },
    check: { marginLeft: "auto" },
    summaryRows: { gap: theme.spacing.sm - 2 },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 2,
    },
    disclaimer: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.muted,
        textAlign: "center",
        lineHeight: 18,
    },
});