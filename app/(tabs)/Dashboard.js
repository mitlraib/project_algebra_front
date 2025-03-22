import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cookies from 'js-cookie';
import styles from '../../styles/styles';

export default function Dashboard() {
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (!navigationState?.key) return; // מוודאים שה־Router מוכן
        const userToken = Cookies.get('userToken');
        if (!userToken) {
            // אם אין טוקן, מעבירים ללוגין
            router.replace('/authentication/Login');
        }
    }, [navigationState?.key, router]);

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
                <View style={[styles.container, styles.centerArea]}>
                    <Text style={styles.appTitle}>ברוכים הבאים לMathJourney!</Text>

                    {/* הגדרה כך שהתמונה לא "תידחף" מתחת ל־AppBar */}
                    <Image
                        source={require('../../assets/images/learning-math.jpg')}
                        style={{
                            width: '80%',
                            height: '90%',
                            aspectRatio: 1.5,
                            resizeMode: 'contain',
                            marginVertical: 10,
                        }}
                    />



                    <Text style={styles.appSubtitle}>
                        האתר שלנו נועד לעזור לך ללמוד חשבון בצורה חכמה ומהנה,
                        {'\n'}
                        עם שאלות מותאמות אישית והתקדמות לפי היכולת שלך
                        {'\n'}
                        בהצלחה!
                    </Text>
                </View>
            </View>
        </ProtectedRoute>
    );
}
