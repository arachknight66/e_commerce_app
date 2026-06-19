import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export default function SplashScreen() {
    const insets = useSafeAreaInsets();

    // Animated values
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const textTranslateY = useRef(new Animated.Value(30)).current;
    const spinnerOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Step 1: Scale and bounce the logo bag icon
        Animated.sequence([
            Animated.parallel([
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
            // Step 2: Fade in and slide up the brand text & tagline
            Animated.parallel([
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(textTranslateY, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                }),
            ]),
            // Step 3: Fade in the spinner
            Animated.timing(spinnerOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.logoWrap}>
                <Animated.View
                    style={[
                        styles.iconCircle,
                        {
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }],
                        },
                    ]}
                >
                    <Ionicons name="bag" size={40} color="#fff" />
                </Animated.View>
                
                <Animated.View
                    style={{
                        opacity: textOpacity,
                        transform: [{ translateY: textTranslateY }],
                        alignItems: "center",
                        gap: theme.spacing.xs,
                    }}
                >
                    <Text style={styles.brand}>Shopify</Text>
                    <Text style={styles.tagline}>Premium Shopping Experience</Text>
                </Animated.View>
            </View>

            <Animated.View style={[styles.spinnerWrap, { opacity: spinnerOpacity }]}>
                <ActivityIndicator color={theme.colors.primary} size="small" />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: "center",
        justifyContent: "center",
    },
    logoWrap: {
        alignItems: "center",
        gap: theme.spacing.sm,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        ...theme.shadow.lg,
    },
    brand: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.dark,
        letterSpacing: -0.5,
        marginTop: theme.spacing.sm,
    },
    tagline: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.muted,
        fontWeight: theme.fontWeight.medium,
    },
    spinnerWrap: {
        position: "absolute",
        bottom: 60,
    },
});