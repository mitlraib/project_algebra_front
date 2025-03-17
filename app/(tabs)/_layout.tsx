import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// הוספנו כאן 4 טאבים: דף הבית, הקורסים שלי, הפרופיל שלי, ואודות.
// אפשר כמובן להתאים לפי הצורך

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="Dashboard"
                options={{
                    title: 'דף הבית',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="MyCourses"
                options={{
                    title: 'הקורסים שלי',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="book.fill" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="MyProfile"
                options={{
                    title: 'הפרופיל שלי',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="person.fill" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="אודות" // זה שם התיקייה/רואט, לדוגמה
                options={{
                    title: 'אודות',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="info.circle.fill" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
