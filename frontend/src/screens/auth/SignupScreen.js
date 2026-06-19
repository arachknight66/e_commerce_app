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
import {
    validateEmail,
    validatePassword,
    validateName,
    validateConfirmPassword,
} from "../../utils/validators";
import { theme } from "../../styles/theme";

export default function SignupScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { register } = useAuth();
    const { success: toastSuccess, error: toastError } = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmRef = useRef(null);

    const validate = () => {
        const errs = {};
        const nameErr = validateName(name);
        const emailErr = validateEmail(email);
        const passErr = validatePassword(password);
        const confirmErr = validateConfirmPassword(password, confirmPassword);
        if (nameErr) errs.name = nameErr;
        if (emailErr) errs.email = emailErr;
        if (passErr) errs.password = passErr;
        if (confirmErr) errs.confirmPassword = confirmErr;
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await register(name.trim(), email.trim(), password);
            toastSuccess("Account created! Welcome aboard.");
        } catch (err) {
            toastError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const clearError = (field) => setErrors((e) => ({ ...e, [field]: null }));

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { paddingTop: insets.top + theme.spacing.lg, paddingBottom: insets.bottom + theme.spacing.xl },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.logoWrap}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="bag" size={28} color="#fff" />
                    </View>
                    <Text style={styles.brand}>Shopify</Text>
                </View>

                <View style={styles.headingWrap}>
                    <Text style={styles.heading}>Create account</Text>
                    <Text style={styles.sub}>Join us and start shopping today</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        value={name}
                        onChangeText={(v) => { setName(v); clearError("name"); }}
                        placeholder="John Doe"
                        autoCapitalize="words"
                        leftIcon="person-outline"
                        error={errors.name}
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                    />
                    <Input
                        inputRef={emailRef}
                        label="Email"
                        value={email}
                        onChangeText={(v) => { setEmail(v); clearError("email"); }}
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
                        onChangeText={(v) => { setPassword(v); clearError("password"); }}
                        placeholder="At least 6 characters"
                        secureTextEntry
                        leftIcon="lock-closed-outline"
                        error={errors.password}
                        returnKeyType="next"
                        onSubmitEditing={() => confirmRef.current?.focus()}
                    />
                    <Input
                        inputRef={confirmRef}
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={(v) => { setConfirmPassword(v); clearError("confirmPassword"); }}
                        placeholder="Repeat password"
                        secureTextEntry
                        leftIcon="shield-checkmark-outline"
                        error={errors.confirmPassword}
                        returnKeyType="done"
                        onSubmitEditing={handleRegister}
                    />
                </View>

                <Button title="Create Account" onPress={handleRegister} loading={loading} />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Pressable onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.footerLink}>Sign in</Text>
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
        gap: theme.spacing.lg,
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
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
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