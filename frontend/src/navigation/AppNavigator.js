import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../hooks/useAuth";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import CheckoutScreen from "../screens/checkout/CheckoutScreen";
import SplashScreen from "../screens/auth/SplashScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isAuthenticated, isLoading } = useAuth();

    // While we're restoring a token from AsyncStorage, reuse the branded
    // splash screen instead of flashing Login first or showing a bare spinner.
    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <Stack.Group>
                    <Stack.Screen name="Main" component={MainNavigator} />
                    <Stack.Screen
                        name="Checkout"
                        component={CheckoutScreen}
                        options={{
                            presentation: "modal",
                            animation: "slide_from_bottom",
                        }}
                    />
                </Stack.Group>
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
}