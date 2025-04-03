//TabLayout:

import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';


export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            initialRouteName="Dashboard" // הגדרת הטאב הראשי כ- "Dashboard"
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
            <Tabs.Screen name="index" options={{ href: null }} />

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
                name="Statistics"
                options={{
                    title: 'סטטיסטיקה',
                    tabBarButton: () => null,
                }}
            />


        </Tabs>
    );
}


//end of TabLayout:
