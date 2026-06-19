import { useState, useRef } from "react";
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
import { validateEmail, validatePassword } from "../../utils/validators";
import { theme } from "../../styles/theme";

export default function LoginScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { login } = useAuth();
    const { success: toastSuccess, error: toastError } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const passwordRef = useRef(null);

    const validate = () => {
        const errs = {};
        const emailErr = validateEmail(email);
        const passErr = validatePassword(password);
        if (emailErr) errs.email = emailErr;
        if (passErr) errs.password = passErr;
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await login(email.trim(), password);
            toastSuccess("Welcome back!");
        } catch (err) {
            toastError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { paddingTop: insets.top + theme.spacing.xl, paddingBottom: insets.bottom + theme.spacing.xl },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Logo */}
                <View style={styles.logoWrap}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="bag" size={28} color="#fff" />
                    </View>
                    <Text style={styles.brand}>Shopify</Text>
                </View>

                {/* Heading */}
                <View style={styles.headingWrap}>
                    <Text style={styles.heading}>Welcome back</Text>
                    <Text style={styles.sub}>Sign in to continue shopping</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: null })); }}
                        placeholder="you@example.com"
                        keyboardType="email-address"
                        leftIcon="mail-outline"
                        error={errors.email}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    <Input
                        inputRef={passwordRef}
                        label="Password"
                        value={password}
                        onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: null })); }}
                        placeholder="••••••••"
                        secureTextEntry
                        leftIcon="lock-closed-outline"
                        error={errors.password}
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                    />
                    <Pressable
                        onPress={() => navigation.navigate("ForgotPassword")}
                        style={styles.forgotBtn}
                    >
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </Pressable>
                </View>

                <Button title="Sign In" onPress={handleLogin} loading={loading} />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Pressable onPress={() => navigation.navigate("Signup")}>
                        <Text style={styles.footerLink}>Sign up</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.colors.background },
    container: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.xl,
    },
    logoWrap: {
        alignItems: "center",
        gap: theme.spacing.sm,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        ...theme.shadow.md,
    },
    brand: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.dark,
        letterSpacing: -0.5,
    },
    headingWrap: { gap: 4 },
    heading: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.dark,
        letterSpacing: -0.5,
    },
    sub: {
        fontSize: theme.fontSize.md,
        color: theme.colors.muted,
    },
    form: { gap: theme.spacing.md },
    forgotBtn: { alignSelf: "flex-end" },
    forgotText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: theme.spacing.xs,
    },
    footerText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.muted,
    },
    footerLink: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
});