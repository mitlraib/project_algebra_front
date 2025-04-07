//TabLayout:

import {Tabs, useRouter} from 'expo-router';
import React, {useEffect, useState} from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



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
                    tabBarIcon: ({color} ) => (
                        <MaterialCommunityIcons name="book-open-page-variant-outline" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="MyProfile"
                options={{
                    title: 'הפרופיל שלי',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account" size={28} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Achivments"
                options={{
                    title: 'הישגים',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="trophy-outline" size={28} color={color} />
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
