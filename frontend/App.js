import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
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

// React Navigation theme — keeps native chrome (header bars, tab bars,
// screen backgrounds during transitions) in sync with our own design
// tokens instead of falling back to RN's default Material blue.
// v7 requires a `fonts` block on any custom theme object, so we spread
// DefaultTheme rather than hand-rolling one.
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

            {/* Mounted once at the root so any screen can fire a toast via
                useToast() without prop-drilling a setter through navigation. */}
            <Toast />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}