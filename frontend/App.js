import "./global.css";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { ToastProvider } from "./src/context/ToastContext";

import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "./src/components/common/Toast";

import { theme } from "./src/styles/theme";

const navigationTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.white,
    text: theme.colors.dark,
    border: theme.colors.border,
    notification: theme.colors.secondary,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <NavigationContainer theme={navigationTheme}>
              <StatusBar style="dark" />
              <AppNavigator />
            </NavigationContainer>
            <Toast />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}