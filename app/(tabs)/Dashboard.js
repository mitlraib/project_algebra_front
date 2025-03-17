import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import styles from '../../styles/styles';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cookies from 'js-cookie';

export default function Dashboard() {
    const router = useRouter();

    function handleStart() {
        // מעבר לשאלות רנדומליות
        router.push("course/randomQuestionPage");
    }

    const handleLogout = () => {
        Cookies.remove('userToken');
        router.replace('/authentication/Login');
    };

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={{ flex: 1 }}>
                {/* סרגל ניווט */}
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                דף הבית
                            </Typography>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 2
                                }}
                            >
                                <Button color="inherit" onClick={handleStart}>התחל</Button>
                                <Button color="inherit">סטטיסטיקות</Button>
                            </Box>
                            <ExitToAppIcon />
                            <Button color="inherit" onClick={handleLogout}>
                                התנתק
                            </Button>
                            <Box sx={{ flex: '0 1 auto' }} />
                        </Toolbar>
                    </AppBar>
                </Box>

                {/* גוף הדף */}
                <View style={[styles.container, localStyles.centerArea]}>
                    <Pressable onPress={() => router.push('/MyCourses')}>
                        <Text style={{ color: 'blue', fontSize: 20, margin: 10 }}>הקורסים שלי</Text>
                    </Pressable>

                    <Pressable onPress={() => router.push('/MyProfile')}>
                        <Text style={{ color: 'blue', fontSize: 20, margin: 10 }}>הפרופיל שלי</Text>
                    </Pressable>
                </View>
            </View>
        </ProtectedRoute>
    );
}

const localStyles = StyleSheet.create({
    centerArea: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});
