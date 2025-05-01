// RootLayout

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { api } from '@/components/api';
import { View, Text, ActivityIndicator } from 'react-native';
import '../src/api/axiosConfig';


export default function RootLayout() {
    const [authChecked, setAuthChecked] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // נבדוק פעם אחת אם המשתמש מחובר
        api.get('/api/user')
            .then(res => {
                if (res.data && res.data.success) {
                    setUser(res.data); // שומר את פרטי המשתמש
                } else {
                    Cookies.remove('userToken');
                    setUser(null);
                }
            })
            .catch(() => {
                // לא מחובר או שגיאה
                Cookies.remove('userToken');
                setUser(null);
            })
            .finally(() => {
                setAuthChecked(true);
            });
    }, []);

    if (!authChecked) {
        // בזמן שהבדיקה מתבצעת
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
                <Text>טוען...</Text>
            </View>
        );
    }

    // בשלב הזה, authChecked=true, ויש לנו user=null או user={...}.
    return (
        <ThemeProvider value={DefaultTheme}>
            {/* ה-Slot ירנדר את שאר המסכים */}
            <Slot />
        </ThemeProvider>
    );
}


//end of  RootLayout
