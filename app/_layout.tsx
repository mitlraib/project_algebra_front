// app/_layout.tsx

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import  api  from  '../src/api/axiosConfig';
import  storage  from './utils/storage';
import '../src/api/axiosConfig';

export default function RootLayout() {
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // מגדירים פונקציה אסינכרונית ומייד מריצים אותה
        (async () => {
            try {
                const { data } = await api.get('/api/user');
                if (!data?.success) {
                    // אין התחברות תקפה -> ננקה טוקן
                    await storage.remove('userToken');
                }
                // אם data.success === true, אפשר לאחסן את נתוני המשתמש ב־global state אם רוצים
            } catch (err) {
                // שגיאה ב-API -> ננקה טוקן
                await storage.remove('userToken');
            } finally {
                setAuthChecked(true);
            }
        })();
    }, []);

    // בזמן הטעינה – נציג גלגל מסתובב
    if (!authChecked) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={DefaultTheme.colors.text} />
                <Text>טוען...</Text>
            </View>
        );
    }

    // ברגע שהבדיקה הסתיימה, נמשיך ל־Slot (כל המסכים עטופים כאן)
    return (
        <ThemeProvider value={DefaultTheme}>
            <Slot />
        </ThemeProvider>
    );
}
