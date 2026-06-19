import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Header from "../../components/common/Header";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { validateEmail } from "../../utils/validators";
import { theme } from "../../styles/theme";

export default function ForgotPasswordScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { forgotPassword } = useAuth();
    const { success: toastSuccess, error: toastError } = useToast();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async () => {
        const err = validateEmail(email);
        if (err) { setEmailError(err); return; }
        setLoading(true);
        try {
            await forgotPassword(email.trim());
            setSent(true);
            toastSuccess("Reset link sent if email exists.");
        } catch (e) {
            toastError(e.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Header title="Reset Password" onBack={() => navigation.goBack()} />
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { paddingBottom: insets.bottom + theme.spacing.xl },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.iconWrap}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="mail-open-outline" size={32} color={theme.colors.primary} />
                    </View>
                </View>

                {sent ? (
                    <View style={styles.sentBox}>
                        <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
                        <Text style={styles.sentTitle}>Check your inbox</Text>
                        <Text style={styles.sentSub}>
                            If that email is registered, you'll receive a reset link shortly.
                        </Text>
                        <Button
                            title="Back to Login"
                            onPress={() => navigation.navigate("Login")}
                            variant="outline"
                        />
                    </View>
                ) : (
                    <View style={styles.form}>
                        <Text style={styles.heading}>Forgot your password?</Text>
                        <Text style={styles.sub}>
                            Enter your email and we'll send you a reset link.
                        </Text>
                        <Input
                            label="Email address"
                            value={email}
                            onChangeText={(v) => { setEmail(v); setEmailError(null); }}
                            placeholder="you@example.com"
                            keyboardType="email-address"
                            leftIcon="mail-outline"
                            error={emailError}
                            returnKeyType="done"
                            onSubmitEditing={handleSubmit}
                        />
                        <Button title="Send Reset Link" onPress={handleSubmit} loading={loading} />
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.colors.background },
    container: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
        gap: theme.spacing.lg,
    },
    iconWrap: { alignItems: "center" },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: theme.borderRadius.full,
        backgroundColor: "#EBF4FF",
        alignItems: "center",
        justifyContent: "center",
    },
    heading: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.dark,
        letterSpacing: -0.5,
    },
    sub: {
        fontSize: theme.fontSize.md,
        color: theme.colors.muted,
        lineHeight: 22,
    },
    form: { gap: theme.spacing.md },
    sentBox: {
        alignItems: "center",
        gap: theme.spacing.md,
        paddingTop: theme.spacing.lg,
    },
    sentTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.dark,
        textAlign: "center",
    },
    sentSub: {
        fontSize: theme.fontSize.md,
        color: theme.colors.muted,
        textAlign: "center",
        lineHeight: 22,
    },
});