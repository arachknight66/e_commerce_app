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

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { getInitials } from "../../utils/formatters";
import { theme } from "../../styles/theme";

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { user, updateProfile, logout } = useAuth();
    const { success: toastSuccess, error: toastError } = useToast();

    const [name, setName] = useState(user?.name || "");
    const [street, setStreet] = useState(user?.address?.street || "");
    const [city, setCity] = useState(user?.address?.city || "");
    const [zip, setZip] = useState(user?.address?.zip || "");
    const [country, setCountry] = useState(user?.address?.country || "");
    const [saving, setSaving] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const hasChanges =
        name !== (user?.name || "") ||
        street !== (user?.address?.street || "") ||
        city !== (user?.address?.city || "") ||
        zip !== (user?.address?.zip || "") ||
        country !== (user?.address?.country || "");

    const handleSave = async () => {
        if (!name.trim()) {
            toastError("Name is required.");
            return;
        }
        setSaving(true);
        try {
            await updateProfile({
                name: name.trim(),
                address: {
                    street: street.trim(),
                    city: city.trim(),
                    zip: zip.trim(),
                    country: country.trim(),
                },
            });
            toastSuccess("Profile updated successfully.");
        } catch (e) {
            toastError(e.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
        } catch (e) {
            toastError("Failed to log out.");
            setLoggingOut(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={[styles.headerBar, { paddingTop: insets.top + theme.spacing.sm }]}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: insets.bottom + theme.spacing.xl },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar + user info */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                    </View>
                    <Text style={styles.userName}>{user?.name || "User"}</Text>
                    <Text style={styles.userEmail}>{user?.email || ""}</Text>
                </View>

                {/* Personal info card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="person-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Personal Information</Text>
                    </View>
                    <Input
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Your name"
                        autoCapitalize="words"
                        leftIcon="person-outline"
                    />
                </View>

                {/* Address card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Shipping Address</Text>
                    </View>
                    <View style={styles.form}>
                        <Input
                            label="Street Address"
                            value={street}
                            onChangeText={setStreet}
                            placeholder="123 Main Street"
                            autoCapitalize="words"
                        />
                        <View style={styles.row}>
                            <View style={styles.half}>
                                <Input
                                    label="City"
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder="New York"
                                    autoCapitalize="words"
                                />
                            </View>
                            <View style={styles.half}>
                                <Input
                                    label="ZIP Code"
                                    value={zip}
                                    onChangeText={setZip}
                                    placeholder="10001"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <Input
                            label="Country"
                            value={country}
                            onChangeText={setCountry}
                            placeholder="United States"
                            autoCapitalize="words"
                        />
                    </View>
                </View>

                {/* Save button */}
                <Button
                    title="Save Changes"
                    onPress={handleSave}
                    loading={saving}
                    disabled={!hasChanges}
                    icon="checkmark-circle-outline"
                    iconPosition="right"
                />

                {/* Divider */}
                <View style={styles.divider} />

                {/* Logout */}
                <Button
                    title="Log Out"
                    onPress={handleLogout}
                    loading={loggingOut}
                    variant="outline"
                    icon="log-out-outline"
                    iconPosition="left"
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.colors.background },
    headerBar: {
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.dark,
    },
    content: {
        padding: theme.spacing.md,
        gap: theme.spacing.md,
    },
    profileHeader: {
        alignItems: "center",
        paddingVertical: theme.spacing.lg,
        gap: theme.spacing.xs,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing.sm,
        ...theme.shadow.md,
    },
    avatarText: {
        color: "#fff",
        fontWeight: theme.fontWeight.extrabold,
        fontSize: theme.fontSize.xxl,
    },
    userName: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.dark,
        letterSpacing: -0.3,
    },
    userEmail: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
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
    form: {
        gap: theme.spacing.md,
    },
    row: {
        flexDirection: "row",
        gap: theme.spacing.sm,
    },
    half: { flex: 1 },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.xs,
    },
});
