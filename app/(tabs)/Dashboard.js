import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';
import styles from '../../styles/styles';
// כאן אני משתמשת ב-MUI (Web) בתוך React Native/Expo

export default function Dashboard() {
    const router = useRouter();

    const handleLogout = async () => {
        // אם תרצי גם לבטל את הסשן בשרת:
        try {
            await axios.post('/api/logout');
        } catch (err) {
            console.log("Logout error:", err);
        }
        // ואז מפנים לדף לוגין
        router.replace('/authentication/Login');
    };

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={{ flex: 1 }}>
                <Box sx={{ flexGrow: 1 }}>

                    <AppBar position="static">

                        <Toolbar>

                            {/*<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>*/}

                            {/*    <MenuIcon />*/}

                            {/*</IconButton>*/}

                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                                HOME

                            </Typography>

                            <Box sx={{

                                flexGrow: 1,

                                display: 'flex',

                                justifyContent: 'center',

                                gap: 2

                            }}>

                                <Button color="inherit">play</Button>

                                <Button color="inherit">Statistic</Button>

                            </Box>

                            <ExitToAppIcon/>

                            <Button color="inherit" onClick={handleLogout}>Logout</Button>



                            {/* Empty right section for balance */}

                            <Box sx={{ flex: '0 1 auto' }} />

                        </Toolbar>

                    </AppBar>

                </Box>


                <View style={styles.container}>
                    <Pressable onPress={() => router.navigate('/(tabs)/MyCourses')}>
                        <Text style={{ color: 'blue' }}>הקורסים שלי</Text>
                    </Pressable>
                    <Pressable onPress={() => router.navigate('/(tabs)/MyProfile')}>
                        <Text style={{ color: 'blue' }}>הפרופיל שלי</Text>
                    </Pressable>

                </View>
            </View>
        </ProtectedRoute>
    );
}
