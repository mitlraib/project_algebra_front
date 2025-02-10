import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Cookies from 'js-cookie';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('userToken');
        router.replace('/authentication/Login');
    };

    return (
        <ProtectedRoute requireAuth={true}>

        <View style={{ flex: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Text style={{ flex: 1, color: 'white', fontSize: 18 }}>Dashboard</Text>
                    <ExitToAppIcon />
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <View>
                <Pressable onPress={() => router.push('/(tabs)/MyCourses')}>
                    <Text style={{ color: 'blue' }}>MyCourses</Text>
                </Pressable>
            </View>
        </View>
        </ProtectedRoute>
    );
}
