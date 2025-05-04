// /components/ProtectedRoute.js
import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, Animated, Text } from 'react-native';
import  api  from  '../src/api/axiosConfig';
import storage from '../app/utils/storage';
import { dashboardStyles } from '../styles/styles';

export default function ProtectedRoute({ children, requireAuth }) {
    const [isInit, setIsInit] = useState(false);
    const [user, setUser]     = useState(null);
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        async function checkAuth() {
            // אם הדף לא דורש auth, נסתיים מיד
            if (!requireAuth) {
                setIsInit(true);
                return;
            }

            try {
                const { data } = await api.get('/api/user');
                if (data.success) {
                    setUser(data);
                } else {
                    await storage.remove('userToken');
                    setUser(null);
                }
            } catch (err) {
                await storage.remove('userToken');
                setUser(null);
            } finally {
                setIsInit(true);
            }
        }

        checkAuth();
    }, [requireAuth]);

    // האנימציה של הסימנים הכיפיים
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue:   0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    // בזמן הטעינה בדפים שדורשים auth
    if (requireAuth && !isInit) return null;

    // אם הדף דורש auth ואין user => נסטה למסך הלוגין
    if (requireAuth && !user) {
        return <Redirect href="/authentication/Login" />;
    }

    // אם הדף **לא** דורש auth, ויש user => כבר מחובר, נקפוץ לדשבורד
    if (!requireAuth && user) {
        return <Redirect href="/(tabs)/Dashboard" />;
    }

    // אחרת, מציגים את מה שיש בתוך ה־ProtectedRoute
    return (
        <View style={{ flex: 1 }}>
            {children}
            <Animated.View
                style={[dashboardStyles.floatingSymbol, { transform: [{ translateY: floatAnim }] }]}
                pointerEvents="none"
            >
                <Text style={dashboardStyles.floatingText}>➕</Text>
            </Animated.View>
            <Animated.View
                style={[dashboardStyles.floatingSymbol, dashboardStyles.bottomLeft, { transform: [{ translateY: floatAnim }] }]}
                pointerEvents="none"
            >
                <Text style={dashboardStyles.floatingText}>➗</Text>
            </Animated.View>
        </View>
    );
}
