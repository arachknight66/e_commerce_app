import { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export default function Input({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    error = null,
    leftIcon = null,
    editable = true,
    multiline = false,
    numberOfLines = 1,
    returnKeyType = "default",
    onSubmitEditing,
    inputRef,
}) {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = secureTextEntry;
    const hideText = isPassword && !showPassword;

    return (
        <View style={styles.wrapper}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View
                style={[
                    styles.inputRow,
                    focused && styles.inputRowFocused,
                    error && styles.inputRowError,
                    !editable && styles.inputRowDisabled,
                ]}
            >
                {leftIcon ? (
                    <Ionicons
                        name={leftIcon}
                        size={18}
                        color={focused ? theme.colors.primary : theme.colors.muted}
                        style={styles.leftIcon}
                    />
                ) : null}
                <TextInput
                    ref={inputRef}
                    style={[styles.input, multiline && styles.multiline]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.muted}
                    secureTextEntry={hideText}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    editable={editable}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                {isPassword ? (
                    <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={18}
                            color={theme.colors.muted}
                        />
                    </Pressable>
                ) : null}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 6,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.dark,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.white,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        minHeight: 50,
    },
    inputRowFocused: {
        borderColor: theme.colors.primary,
    },
    inputRowError: {
        borderColor: theme.colors.danger,
    },
    inputRowDisabled: {
        backgroundColor: theme.colors.light,
        opacity: 0.7,
    },
    leftIcon: {
        marginRight: theme.spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: theme.fontSize.md,
        color: theme.colors.dark,
        paddingVertical: theme.spacing.sm,
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    eyeBtn: {
        padding: theme.spacing.xs,
        marginLeft: theme.spacing.xs,
    },
    error: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.danger,
        fontWeight: theme.fontWeight.medium,
    },
});