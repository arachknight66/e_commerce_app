import { useRef, useState, useCallback } from "react";
import {
    View,
    FlatList,
    Pressable,
    Text,
    StyleSheet,
    Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { theme } from "../../styles/theme";
import { formatPrice } from "../../utils/formatters";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - theme.spacing.md * 2;
const CARD_HEIGHT = 200;

const PLACEHOLDER = "https://via.placeholder.com/600x400?text=Featured";

export default function BannerCarousel({ products = [], onPress }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const listRef = useRef(null);

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }, []);

    if (!products.length) return null;

    return (
        <View style={styles.wrapper}>
            <FlatList
                ref={listRef}
                data={products}
                keyExtractor={(item) => item._id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + theme.spacing.sm}
                decelerationRate="fast"
                contentContainerStyle={styles.list}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => onPress(item)}
                        style={styles.card}
                    >
                        <Image
                            source={{ uri: item.images?.[0] || PLACEHOLDER }}
                            style={styles.image}
                            contentFit="cover"
                            transition={300}
                        />
                        <View style={styles.overlay}>
                            <Text style={styles.brand}>
                                {item.brand?.toUpperCase() || "FEATURED"}
                            </Text>
                            <Text style={styles.name} numberOfLines={2}>
                                {item.name}
                            </Text>
                            <Text style={styles.price}>{formatPrice(item.price)}</Text>
                        </View>
                    </Pressable>
                )}
            />
            {products.length > 1 && (
                <View style={styles.dots}>
                    {products.map((_, i) => (
                        <View
                            key={i}
                            style={[styles.dot, i === activeIndex && styles.dotActive]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: theme.spacing.sm,
    },
    list: {
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: theme.borderRadius.xl,
        overflow: "hidden",
        backgroundColor: theme.colors.card,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        background: "transparent",
        backgroundColor: "rgba(0,0,0,0.38)",
        justifyContent: "flex-end",
        padding: theme.spacing.md,
    },
    brand: {
        fontSize: 10,
        fontWeight: theme.fontWeight.bold,
        color: "rgba(255,255,255,0.75)",
        letterSpacing: 1.2,
        marginBottom: 2,
    },
    name: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: "#fff",
        lineHeight: 24,
    },
    price: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: "rgba(255,255,255,0.9)",
        marginTop: 4,
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
        marginTop: theme.spacing.sm,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.border,
    },
    dotActive: {
        backgroundColor: theme.colors.primary,
        width: 18,
    },
});