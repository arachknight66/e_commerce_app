import { ScrollView, Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from "../../utils/constants";
import { theme } from "../../styles/theme";

export default function CategoryRow({ selectedCategory, onSelect }) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                    <Pressable
                        key={cat.id}
                        onPress={() => onSelect(cat.id)}
                        style={[styles.pill, active && styles.pillActive]}
                    >
                        <Ionicons
                            name={cat.icon}
                            size={15}
                            color={active ? "#fff" : theme.colors.muted}
                        />
                        <Text style={[styles.label, active && styles.labelActive]}>
                            {cat.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        gap: theme.spacing.sm,
    },
    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm - 2,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.white,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
    },
    pillActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.muted,
    },
    labelActive: {
        color: "#fff",
        fontWeight: theme.fontWeight.semibold,
    },
});