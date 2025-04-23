import React, { useEffect, useState, useRef } from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, Dimensions, StyleSheet, Animated,} from 'react-native';
import { useRouter } from 'expo-router';
import { ProgressBar } from 'react-native-paper';
import { FontAwesome, Feather } from '@expo/vector-icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Cookies from 'js-cookie';
import {dashboardStyles} from '../../styles/styles'

const Colors = {
    primary: '#8b5cf6',
    accent: '#fb923c',
    success: '#fb923c',
    danger: '#EF4444',
};

export default function Dashboard() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progressData, setProgressData] = useState({ stars: 0, level: 0, progress: 0 });

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                })
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    useEffect(() => {
        const token = Cookies.get('userToken');

        if (!token) {
            // נשתמש ב-setTimeout קטן כדי לא לעשות ניווט מיידי
            setTimeout(() => {
                router.replace('/authentication/Login');
            }, 0);
            return;
        }

        axios.get('/api/user', { withCredentials: true })
            .then(response => {
                const data = response.data;
                if (data.success && data.role?.toUpperCase() === "ADMIN") {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
                const { level, totalExercises, totalMistakes } = data;
                const correctAnswers = totalExercises - totalMistakes;
                const progress = totalExercises > 0 ? correctAnswers / totalExercises : 0;
                setProgressData({ stars: correctAnswers, level, progress });
            })
            .catch(error => {
                console.log("ERROR:", error);
                setIsAdmin(false);
            })
            .finally(() => setLoading(false));
    }, []);


    if (loading) {
        return <Text>טעינה...</Text>; // או קומפוננטת טעינה אם יש לך כזו
    }

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (e) {
            console.log('Logout error:', e);
        }
        Cookies.remove('userToken');
        router.replace('/authentication/Login');
    };

    const fakeProgress = {
        stars: 12,
        level: 3,
        progress: 0.33,
    };
    return (
        <ProtectedRoute requireAuth={true}>
            <View contentContainerStyle={dashboardStyles.scrollContainer}>
                <View style={dashboardStyles.header}>
                    {/* לוגו מצד שמאל */}
                    <Text style={dashboardStyles.logo}>
                        <Text style={{ color: Colors.primary }}>Math</Text>
                        <Text style={{ color: Colors.accent }}>Journey</Text>
                    </Text>



                    {/* כפתור התנתקות מצד ימין */}
                    <TouchableOpacity onPress={handleLogout} style={dashboardStyles.logoutIconButton}>
                        <Feather name="log-out" size={18} color={Colors.primary} />
                        <Text style={dashboardStyles.logoutLabel}>התנתקות</Text>
                    </TouchableOpacity>
                </View>


                <LinearGradient
                    colors={[Colors.primary, Colors.accent]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={dashboardStyles.gradientTitleWrapper}
                >
                    <Text style={dashboardStyles.gradientTitle}>ברוכים הבאים ל MathJourney!</Text>
                </LinearGradient>
                <Animated.View style={[dashboardStyles.floatingSymbol, { transform: [{ translateY: floatAnim }] }]}> <Text style={dashboardStyles.floatingText}>➕</Text> </Animated.View>
                <Animated.View style={[dashboardStyles.floatingSymbol, dashboardStyles.bottomLeft, { transform: [{ translateY: floatAnim }] }]}> <Text style={dashboardStyles.floatingText}>➗</Text> </Animated.View>

                <View style={dashboardStyles.rowWrapper}>

                    {isAdmin && (
                        <View style={dashboardStyles.statisticsBox}>
                            <View style={dashboardStyles.iconCircle}>
                                <Feather name="pie-chart" size={24} color={Colors.accent} />
                            </View>
                            <Text style={dashboardStyles.title}>סטטיסטיקה</Text>
                            <Text style={dashboardStyles.statisticsDescription}>סטטיסטיקה למנהלים בלבד !</Text>
                            <TouchableOpacity style={dashboardStyles.statisticsButton} onPress={() => router.push('/Statistics')}>
                                <Text style={dashboardStyles.statisticsButtonText}>סטטיסטיקה </Text>
                            </TouchableOpacity>
                        </View>

                    )}


                    {/* ריבוע בצד שמאל */}
                    <View style={dashboardStyles.columnWrapper}>


                    <View style={dashboardStyles.marathonBox}>
                        <View style={dashboardStyles.iconCircle}>
                            <Feather name="watch" size={24} color={Colors.accent} />
                        </View>
                        <Text style={dashboardStyles.title}>אימון מרתון</Text>
                        <Text style={dashboardStyles.marathonDescription}>אימון מהיר על כל החומר שלמדת עד כה</Text>

                        <TouchableOpacity
                            style={dashboardStyles.marathonButton}
                            onPress={() => router.push('/course/randomQuestionPage')}
                        >
                            <Text style={dashboardStyles.marathonButtonText}>אימון</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={dashboardStyles.achievementsBox}>
                        <View style={dashboardStyles.iconCircle}>
                            <Feather name="award" size={24} color={Colors.accent} />
                        </View>
                        <Text style={dashboardStyles.title}> הישגים</Text>
                        <Text style={dashboardStyles.achievementsDescription}>כל ההישגים שצברת עד כה  </Text>

                        <TouchableOpacity
                            style={dashboardStyles.achievementsButton}
                            onPress={() => router.push('/Achivments')}
                        >
                            <Text style={dashboardStyles.achievementsButtonText}>הישגים</Text>
                        </TouchableOpacity>
                    </View>


                    </View>



                    {/* כל התוכן בתוך mainCard בצד ימין */}
                    <View style={dashboardStyles.mainCard}>


                        <Text style={dashboardStyles.title}>
                            האתר שלנו נועד לעזור לך ללמוד חשבון בצורה חכמה ומהנה, עם שאלות מותאמות אישית והתקדמות לפי היכולת שלך.
                        </Text>

                        <Image
                            source={require('../../assets/images/learning-math.jpg')}
                            style={dashboardStyles.imageStyle}
                        />
                        <View style={{flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
                        <Text style={dashboardStyles.greetingText}>שלום! </Text>

                        <View style={dashboardStyles.emojiWrapper}>
                            <Animated.View style={[dashboardStyles.emojiCircle, { transform: [{ scale: pulseAnim }] }]}>
                                <Text style={dashboardStyles.emoji}>👋</Text>
                            </Animated.View>
                        </View>

                        <Text style={dashboardStyles.secondGreetingText}> מוכנים ללמוד חשבון?</Text>
                        </View>
                        <View style={dashboardStyles.cardContainer}>
                            <View style={dashboardStyles.card}>
                                <View style={{flexDirection:'row-reverse', justifyContent:'center'}}>
                                <Text style={dashboardStyles.title}>
                                    {progressData.progress < 0.3
                                        ? "אתה בתחילת הדרך! המשך ללמוד כדי להשתפר..."
                                        : progressData.progress < 0.6
                                            ? " אתה בדרך הנכונה!"
                                            : " כל הכבוד !"}
                                </Text>
                                </View>
                                <View style={dashboardStyles.progressWrapper}>
                                    <Text style={dashboardStyles.progressText}>
                                        <FontAwesome name="check-circle" size={18} color="#4F46E5" />{' '}
                                        הצלחת ב-{(progressData.progress * 100).toFixed(0)}% מהשאלות שפתרת
                                    </Text>

                                    <View style={dashboardStyles.progressBarContainer}>
                                        <ProgressBar
                                            progress={progressData.progress}
                                            color={
                                                progressData.progress >= 0.8
                                                    ? Colors.success
                                                    : progressData.progress >= 0.5
                                                        ? Colors.primary
                                                        : Colors.danger
                                            }
                                            style={dashboardStyles.progress}
                                        />

                                    </View>
                                </View>
                            </View>

                            <Text style={dashboardStyles.cardPercentage}>
                                {(progressData.progress * 100).toFixed(0)}%
                            </Text>

                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/MyCourses')}
                                style={dashboardStyles.pillButtonPurple}
                            >
                                <Feather name="play" size={28} color="#fff" />
                                <Text style={dashboardStyles.buttonText}>התחל תרגול</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Mini cards */}
                        <View style={dashboardStyles.grid}>



                        </View>
                    </View>
                </View>
            </View>
        </ProtectedRoute>
    );
}


