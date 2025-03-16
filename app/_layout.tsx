// RootLayout.jsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import Cookies from 'js-cookie';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const [user, setUser] = useState<string | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const token = Cookies.get('userToken');
        setUser(token || null);
        setCheckingAuth(false);
    }, []);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (checkingAuth) {
        return null; // מחכה לוודא אם המשתמש מחובר לפני טעינת המסכים
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack
                screenOptions={{
                    headerShown: false, // מבטל את כל הכותרות כברירת מחדל
                }}
            >
                {user ? (
                    <>
                        <Stack.Screen name="(tabs)/Dashboard"  options={{ title: 'דף הבית' }} />
                        <Stack.Screen name="(tabs)/MyCourses" options={{ title: 'הקורסים שלי '}} />
                        <Stack.Screen name="course/[id]" />

                        {/* הוספנו את המסך החדש */}
                        <Stack.Screen name="randomQuestionPage" options={{ title: 'שאלה רנדומלית' }} />

                        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
                    </>
                ) : (
                    <Stack.Screen name="authentication/Login" />
                )}
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
    );
}
