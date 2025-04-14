import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    StyleSheet,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
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
        if (!token) return router.replace('/authentication/Login');

        axios.get('/api/user', { withCredentials: true })
            .then(response => {
                const { level, totalExercises, totalMistakes, role, success } = response.data;
                if (success && role?.toUpperCase() === "ADMIN") setIsAdmin(true);

                const correctAnswers = totalExercises - totalMistakes;
                const progress = totalExercises > 0 ? correctAnswers / totalExercises : 0;
                setProgressData({ stars: correctAnswers, level, progress });
            })
            .catch(error => {
                console.log("ERROR:", error);
                setIsAdmin(false);
            })
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (e) {
            console.log('Logout error:', e);
        }
        Cookies.remove('userToken');
        router.replace('/authentication/Login');
    };

    if (loading) return <Text style={styles.loading}>טוען...</Text>;

    return (
        <ProtectedRoute requireAuth={true}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animated.View style={[styles.floatingSymbol, { transform: [{ translateY: floatAnim }] }]}> <Text style={styles.floatingText}>➕</Text> </Animated.View>
                <Animated.View style={[styles.floatingSymbol, styles.bottomLeft, { transform: [{ translateY: floatAnim }] }]}> <Text style={styles.floatingText}>➗</Text> </Animated.View>

                <View style={styles.mainCard}>
                    <LinearGradient colors={[Colors.primary, Colors.accent]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.gradientTitleWrapper}>
                        <Text style={styles.gradientTitle}>ברוכים הבאים ל MathJourney!</Text>
                    </LinearGradient>

                    <Text style={styles.subtitle}>האתר שלנו נועד לעזור לך ללמוד חשבון בצורה חכמה ומהנה, עם שאלות מותאמות אישית והתקדמות לפי היכולת שלך.</Text>

                    <View style={styles.emojiWrapper}>
                        <Animated.View style={[styles.emojiCircle, { transform: [{ scale: pulseAnim }] }]}> <Text style={styles.emoji}>👋</Text> </Animated.View>
                    </View>

                    <Text style={styles.greetingText}>שלום! מוכנים ללמוד מתמטיקה?</Text>

                    <View style={styles.cardContainer}>
                        <Text style={styles.cardHeader}>ההתקדמות שלך</Text>
                        <Text style={styles.cardSubtext}>התקדמות כללית</Text>
                        <View style={styles.progressBarWrapper}>
                            <View
                                style={[styles.progressInner,
                                    {
                                        width: `${(progressData.progress * 100)}%`,
                                        backgroundColor:
                                            progressData.progress >= 0.8
                                                ? Colors.success
                                                : progressData.progress >= 0.5
                                                    ? Colors.primary
                                                    : Colors.danger,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.cardPercentage}>{(progressData.progress * 100).toFixed(0)}%</Text>
                    </View>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.pillButtonPurple} onPress={() => router.push('/MyCourses')}>
                            <Text style={styles.buttonText}>המשך ללמוד</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.pillButtonOrange} onPress={() => router.push('/course/randomQuestionPage')}>
                            <Text style={styles.buttonText}>אימון מרתון</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}> <Text style={styles.logoutText}>התנתקות</Text> </TouchableOpacity>
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
        width: 80,
        height: 80,
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
        textAlign: 'center',
        fontSize: 18,
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
});