// app/_layout.tsx
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthProvider, AuthContext } from '../components/ui/AuthProvider'; // ✅ נתיב נכון

export default function RootLayout() {
    return (
        <AuthProvider>
            <AuthLoader> {/* ✅ מציג טעינת מסך אם צריך */}
                <ThemeProvider value={DefaultTheme}>
                    <Slot />
                </ThemeProvider>
            </AuthLoader>
        </AuthProvider>
    );
}
// AuthLoader - רכיב טעינה עם טיפוס נכון ל-children
function AuthLoader({ children }: { children: React.ReactNode }) {
    const { isInit } = React.useContext(AuthContext);

    if (!isInit) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={DefaultTheme.colors.text} />
                <Text>טוען...</Text>
            </View>
        );
    }

    return <>{children}</>;
}