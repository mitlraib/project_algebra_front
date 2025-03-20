import React, { useEffect } from 'react'; // ייבוא useEffect
import { View, Pressable, Text, Image, StyleSheet } from 'react-native';
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

    useEffect(() => {
        // בדיקה אם יש טוקן
        const userToken = Cookies.get('userToken');
        if (!userToken) {
            router.replace('/authentication/Login');  // העברה לדף הכניסה אם אין טוקן
        }
    }, [router]);

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
                    {/* הוספת תמונה */}
                    <Image
                        source={require('../../assets/images/learning-math.jpg')} // הנתיב לתמונה המקומית שלך
                        style={styles.imageStyle} // סטייל עבור התמונה
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

;
