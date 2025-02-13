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
  const [user, setUser] = useState(null);
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
        <Stack>
          {user ? (
              <>
                <Stack.Screen name="(tabs)/Dashboard" options={{ title: 'Dashboard' }} />
                <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
                <Stack.Screen name="(tabs)/MyCourses" options={{ title: 'My Courses' }} />
                <Stack.Screen name="course/[id]" options={{ title: 'Course Details' }} />
              </>
          ) : (
              <Stack.Screen name="authentication/Login" options={{ headerShown: false }} />
          )}
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
  );
}
