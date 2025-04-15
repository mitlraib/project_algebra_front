import React, { useEffect, useState, useRef } from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, Dimensions, StyleSheet, Animated,} from 'react-native';
import { useRouter } from 'expo-router';
import { ProgressBar } from 'react-native-paper';
import { FontAwesome, Feather } from '@expo/vector-icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Cookies from 'js-cookie';

const Colors = {
    primary: '#8b5cf6',
    accent: '#fb923c',
    background: '#f8f6ff',
    light: '#ede9fe',
    secondary: '#7c3aed',
    success: '#10B981',
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    {/* לוגו מצד שמאל */}
                    <Text style={styles.logo}>
                        <Text style={{ color: Colors.primary }}>Math</Text>
                        <Text style={{ color: Colors.accent }}>Journey</Text>
                    </Text>



                    {/* כפתור התנתקות מצד ימין */}
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutIconButton}>
                        <Feather name="log-out" size={18} color={Colors.primary} />
                        <Text style={styles.logoutLabel}>התנתקות</Text>
                    </TouchableOpacity>
                </View>


                <LinearGradient
                    colors={[Colors.primary, Colors.accent]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.gradientTitleWrapper}
                >
                    <Text style={styles.gradientTitle}>ברוכים הבאים ל MathJourney!</Text>
                </LinearGradient>
                <Animated.View style={[styles.floatingSymbol, { transform: [{ translateY: floatAnim }] }]}> <Text style={styles.floatingText}>➕</Text> </Animated.View>
                <Animated.View style={[styles.floatingSymbol, styles.bottomLeft, { transform: [{ translateY: floatAnim }] }]}> <Text style={styles.floatingText}>➗</Text> </Animated.View>

                <View style={styles.rowWrapper}>
                    {/* ריבוע בצד שמאל */}
                    <View style={styles.columnWrapper}>


                    <View style={styles.marathonBox}>
                        <View style={styles.iconCircle}>
                            <Feather name="watch" size={24} color={Colors.accent} />
                        </View>
                        <Text style={styles.marathonTitle}>אימון מרתון</Text>
                        <Text style={styles.marathonDescription}>אימון מהיר על כל החומר שלמדת עד כה</Text>

                        <TouchableOpacity
                            style={styles.marathonButton}
                            onPress={() => router.push('/course/randomQuestionPage')}
                        >
                            <Text style={styles.marathonButtonText}>אימון</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.achievementsBox}>
                        <View style={styles.iconCircle}>
                            <Feather name="watch" size={24} color={Colors.accent} />
                        </View>
                        <Text style={styles.achievementsTitle}> הישגים</Text>
                        <Text style={styles.achievementsDescription}>כל ההישגים שצברת עד כה  </Text>

                        <TouchableOpacity
                            style={styles.achievementsButton}
                            onPress={() => router.push('/Achivments')}
                        >
                            <Text style={styles.achievementsButtonText}>הישגים</Text>
                        </TouchableOpacity>
                    </View>
                        {isAdmin && (
                            <View style={styles.statisticsBox}>
                                <View style={styles.iconCircle}>
                                    <Feather name="watch" size={24} color={Colors.accent} />
                                </View>
                                <Text style={styles.statisticsTitle}>סטטיסטיקה</Text>
                                <Text style={styles.statisticsDescription}>סטטיסטיקה למנהלים בלבד !</Text>
                                <TouchableOpacity style={styles.statisticsButton} onPress={() => router.push('/Statistics')}>
                                    <Text style={styles.statisticsButtonText}>סטטיסטיקה </Text>
                            </TouchableOpacity>
                            </View>

                        )}

                    </View>

                    {/* כל התוכן בתוך mainCard בצד ימין */}
                    <View style={styles.mainCard}>


                        <Text style={styles.subtitle}>
                            האתר שלנו נועד לעזור לך ללמוד חשבון בצורה חכמה ומהנה, עם שאלות מותאמות אישית והתקדמות לפי היכולת שלך.
                        </Text>

                        <Image
                            source={require('../../assets/images/learning-math.jpg')}
                            style={styles.imageStyle}
                        />
                        <View style={{flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
                        <Text style={styles.greetingText}>שלום! </Text>

                        <View style={styles.emojiWrapper}>
                            <Animated.View style={[styles.emojiCircle, { transform: [{ scale: pulseAnim }] }]}>
                                <Text style={styles.emoji}>👋</Text>
                            </Animated.View>
                        </View>

                        <Text style={styles.secondGreetingText}> מוכנים ללמוד חשבון?</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.card}>
                                <View style={{flexDirection:'row-reverse', justifyContent:'center'}}>
                                <Text style={styles.cardHeader}>ההתקדמות שלך:  </Text>
                                <Text style={styles.progressDescription}>
                                    {progressData.progress < 0.3
                                        ? "אתה בתחילת הדרך! המשך ללמוד כדי להשתפר."
                                        : progressData.progress < 0.6
                                            ? " אתה בדרך הנכונה."
                                            : " כל הכבוד על ההתקדמות המרשימה!"}
                                </Text>
                                </View>
                                <Text style={styles.progressText}>
                                    <FontAwesome name="check-circle" size={18} color="#4F46E5" />{' '}
                                    {` הצלחת ב-${(progressData.progress * 100).toFixed(0)}% מהשאלות`}
                                </Text>

                                <ProgressBar
                                    progress={progressData.progress}
                                    color={
                                        progressData.progress >= 0.8
                                            ? Colors.success
                                            : progressData.progress >= 0.5
                                                ? Colors.primary
                                                : Colors.danger
                                    }
                                    style={styles.progress}
                                />
                            </View>

                            <Text style={styles.cardPercentage}>
                                {(progressData.progress * 100).toFixed(0)}%
                            </Text>

                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/MyCourses')}
                                style={styles.pillButtonPurple}
                            >
                                <Feather name="play" size={28} color="#fff" />
                                <Text style={styles.buttonText}>התחל תרגול</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Mini cards */}
                        <View style={styles.grid}>



                        </View>
                    </View>
                </View>
            </ScrollView>
        </ProtectedRoute>
    );
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: Colors.background,
    },
    rowWrapper: {
        flexDirection: 'row', // כדי שהריבוע יהיה בשמאל
        justifyContent:'flex-end',
        alignItems: 'flex-start',
        width: '90%',
        marginRight:300,
        marginTop:25,
        gap: 30, // רווח בין הצדדים
    },

    columnWrapper:{
        flexDirection:'column',
        alignItems:'space-between',
        justifyContent:'space-between',
        paddingTop: 5,
        paddingRight:100
    },

achievementsBox: {
        width: 220,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },


    achievementsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 4,
        textAlign: 'center',
    },

    achievementsDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 16,
    },

    achievementsButton: {
        backgroundColor: Colors.accent,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginTop: 8,
        alignSelf: 'stretch',
        alignItems: 'center',
    },

    achievementsButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },

    statisticsBox: {
        width: 220,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    statisticsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 4,
        textAlign: 'center',
    },

    statisticsDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 16,
    },

    statisticsButton: {
        backgroundColor: Colors.accent,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginTop: 8,
        alignSelf: 'stretch',
        alignItems: 'center',
    },

    statisticsButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },

    marathonBox: {
        width: 220,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom:70,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ede9fe',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    marathonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 4,
        textAlign: 'center',
    },

    marathonDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 16,
    },

    marathonButton: {
        backgroundColor: Colors.accent,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginTop: 8,
        alignSelf: 'stretch',
        alignItems: 'center',
    },

    marathonButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },

    mainCard: {
        width: width > 768 ? 700 : '90%',
        padding: 24,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    gradientTitleWrapper: {
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,

    },
    gradientTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginBottom: 16,
    },
    emojiWrapper: {
        alignItems: 'center',
        marginVertical: 8,
    },
    emojiCircle: {
        backgroundColor: Colors.light,
        borderRadius: 100,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    emoji: {
        fontSize: 40,
    },
    greetingText: {
        marginTop:20,
        marginRight:130,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 24,
    },
    secondGreetingText: {
        marginTop:20,
        marginLeft:40,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: Colors.secondary,
        marginBottom: 24,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 24,
    },
    cardHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
        color: Colors.secondary,
    },
    cardSubtext: {
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    progressBarWrapper: {
        height: 12,
        borderRadius: 10,
        backgroundColor: '#e5e5e5',
        overflow: 'hidden',
    },
    header: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    logo: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    logoutIconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    logoutLabel: {
        color: Colors.primary,
        fontWeight: '600',
        marginRight: 6,
        fontSize: 14,
    },

    progressInner: {
        height: '100%',
        borderRadius: 10,
    },
    cardPercentage: {
        textAlign: 'center',
        marginTop: 4,
        fontWeight: '500',
        fontSize: 12,
    },
    buttonGroup: {
        gap: 16,
        marginBottom: 24,
    },
    pillButtonPurple: {
        marginTop: 50,
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 100,
        alignItems: 'center',
    },
    pillButtonOrange: {
        backgroundColor: Colors.accent,
        paddingVertical: 14,
        borderRadius: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        marginTop: 8,
        padding: 14,
        backgroundColor: Colors.danger,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    floatingSymbol: {
        position: 'absolute',
        top: 100,
        right: 20,
        opacity: 0.15,
    },
    bottomLeft: {
        top: undefined,
        bottom: 150,
        left: 20,
        right: undefined,
    },
    floatingText: {
        fontSize: 64,
    },
    loading: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
    },

    imageStyle: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        marginBottom: 16,
    },

    progress: {
        height: 15,
        borderRadius: 10,
        marginTop: 30,

    },

    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },

    progressText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 4,
        marginBottom: 4,
        textAlign: 'center',
    },

    progressDescription: {
        color: '#6B7280',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 4,
    },


});