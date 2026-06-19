import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

import HomeStackNavigator from "./HomeStackNavigator";
import CartScreen from "../screens/cart/CartScreen";
import OrderHistoryScreen from "../screens/orders/OrderHistoryScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

import { useCart } from "../hooks/useCart";
import { theme } from "../styles/theme";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
    HomeTab: { focused: "home", unfocused: "home-outline" },
    CartTab: { focused: "cart", unfocused: "cart-outline" },
    OrdersTab: { focused: "receipt", unfocused: "receipt-outline" },
    ProfileTab: { focused: "person", unfocused: "person-outline" },
};

// Cart gets its own icon component instead of a plain Ionicon so we can
// overlay a live item-count badge without touching the other tabs.
function CartIcon({ focused, color, size }) {
    const { totalItems } = useCart();
    const iconName = focused ? TAB_ICONS.CartTab.focused : TAB_ICONS.CartTab.unfocused;

    return (
        <View style={{ width: size + 4, height: size + 4 }}>
            <Ionicons name={iconName} size={size} color={color} />
            {totalItems > 0 && (
                <View
                    style={{
                        position: "absolute",
                        top: -4,
                        right: -6,
                        minWidth: 16,
                        height: 16,
                        paddingHorizontal: 3,
                        borderRadius: theme.borderRadius.full,
                        backgroundColor: theme.colors.secondary,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.white,
                            fontSize: 10,
                            fontWeight: theme.fontWeight.bold,
                        }}
                    >
                        {totalItems > 9 ? "9+" : totalItems}
                    </Text>
                </View>
            )}
        </View>
    );
}

export default function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.muted,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: theme.fontSize.xs,
                    fontWeight: theme.fontWeight.medium,
                    marginTop: -2,
                    marginBottom: 4,
                },
                tabBarStyle: {
                    height: 64,
                    paddingTop: 8,
                    paddingBottom: 8,
                    backgroundColor: theme.colors.white,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                    ...theme.shadow.sm,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === "CartTab") {
                        return <CartIcon focused={focused} color={color} size={size - 2} />;
                    }
                    const icons = TAB_ICONS[route.name];
                    const iconName = focused ? icons.focused : icons.unfocused;
                    return <Ionicons name={iconName} size={size - 2} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: "Home" }} />
            <Tab.Screen name="CartTab" component={CartScreen} options={{ title: "Cart" }} />
            <Tab.Screen name="OrdersTab" component={OrderHistoryScreen} options={{ title: "Orders" }} />
            <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profile" }} />
        </Tab.Navigator>
    );
}