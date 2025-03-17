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
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        {/* הטאב הראשי */}
                        <Stack.Screen name="(tabs)/TabLayout" />
                        {/* מסכים פנימיים */}
                        <Stack.Screen name="Dashboard" />
                        <Stack.Screen name="MyCourses" />
                        <Stack.Screen name="MyProfile" />
                        <Stack.Screen name="course/[id]" />
                        <Stack.Screen name="randomQuestionPage" />

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
