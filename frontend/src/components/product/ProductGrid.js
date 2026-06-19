import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import ProductCard from "./ProductCard";
import { theme } from "../../styles/theme";

const { width } = Dimensions.get("window");
const COLUMN_GAP = theme.spacing.sm;
const PADDING = theme.spacing.md;
const CARD_WIDTH = (width - PADDING * 2 - COLUMN_GAP) / 2;

export default function ProductGrid({ products, onProductPress, ListHeaderComponent, ListFooterComponent, onEndReached }) {
    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            renderItem={({ item }) => (
                <ProductCard
                    product={item}
                    onPress={() => onProductPress(item)}
                    style={{ width: CARD_WIDTH }}
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PADDING,
        paddingBottom: theme.spacing.xl,
    },
    row: {
        gap: COLUMN_GAP,
        marginBottom: COLUMN_GAP,
    },
});