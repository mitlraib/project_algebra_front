// Dashboard


import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ProgressBar } from 'react-native-paper';
import { FontAwesome, Feather } from '@expo/vector-icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cookies from 'js-cookie';

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {

        const token = Cookies.get('userToken');
        if (!token) {
            router.replace('/authentication/Login');
        }
    }, [router]);

    const handleLogout = () => {
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
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.container}>
                    {/* כותרת ותמונה */}
                    <Text style={styles.mainTitle}>ברוכים הבאים לMathJourney!</Text>
                    <Image
                        source={require('../../assets/images/learning-math.jpg')}
                        style={styles.imageStyle}
                    />
                    <Text style={styles.description}>
                        האתר שלנו נועד לעזור לך ללמוד חשבון בצורה חכמה ומהנה,
                        {'\n'}
                        עם שאלות מותאמות אישית והתקדמות לפי היכולת שלך
                        {'\n'}
                        בהצלחה!
                    </Text>

                    {/* כותרות כלליות */}
                    <Text style={styles.title}>👋 שלום!</Text>
                    <Text style={styles.subtitle}>מוכנים ללמוד מתמטיקה?</Text>

                    {/* Progress Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>ההתקדמות שלך</Text>
                            <View style={styles.stars}>
                                <FontAwesome name="star" size={18} color="#FACC15" />
                                <Text style={styles.starText}>{fakeProgress.stars}</Text>
                            </View>
                        </View>
                        <ProgressBar progress={fakeProgress.progress} color="#4F46E5" style={styles.progress} />
                        <Text style={styles.levelText}>רמה {fakeProgress.level}</Text>
                    </View>

                    {/* Continue Learning */}
                    <TouchableOpacity style={styles.continueCard} onPress={() => router.push('/MyCourses')}>
                        <View>
                            <Text style={styles.continueTitle}>המשך ללמוד</Text>
                            <Text style={styles.continueSub}>הקורסים שלך מחכים לך</Text>
                        </View>
                        <Feather name="play" size={28} color="#fff" />
                    </TouchableOpacity>

                    {/* Mini cards */}
                    <View style={styles.grid}>
                        <TouchableOpacity style={styles.miniCard} onPress={() => router.push('/course/randomQuestionPage')}>
                            <Text style={styles.miniTitle}>אימון</Text>
                            <Text style={styles.miniSub}>חזקו את היכולות</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.miniCard} onPress={() => router.push('/Achivments')}>
                            <Text style={styles.miniTitle}>הישגים</Text>
                            <Text style={styles.miniSub}>ראו את התגים שלכם</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.miniCard} onPress={() => router.push('/Statistics')}>
                            <Text style={styles.miniTitle}>סטטיסטיקה</Text>
                            <Text style={styles.miniSub}>מעקב אחרי ההתקדמות</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Logout */}
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                        <Text style={styles.logoutText}>התנתק</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ProtectedRoute>
    );
}

const { width } = Dimensions.get('window');
const containerWidth = width > 768 ? 700 : '90%';

const styles = StyleSheet.create({
    scroll: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    container: {
        width: containerWidth,
        padding: 24,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        color: '#111827',
    },
    imageStyle: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        marginBottom: 16,
    },
    description: {
        textAlign: 'center',
        fontSize: 16,
        color: '#374151',
        marginBottom: 24,
        lineHeight: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 6,
    },
    subtitle: {
        textAlign: 'center',
        color: 'gray',
        marginBottom: 24,
        fontSize: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    cardTitle: {
        fontWeight: '600',
        fontSize: 16,
    },
    stars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starText: {
        marginLeft: 6,
        fontWeight: '700',
        fontSize: 16,
    },
    progress: {
        height: 10,
        borderRadius: 10,
        marginTop: 4,
        marginBottom: 12,
    },
    levelText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 50,
    },
    continueCard: {
        backgroundColor: '#4F46E5',
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 24,
    },
    continueTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    continueSub: {
        color: '#E0E7FF',
        fontSize: 14,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    miniCard: {
        width: '30%',
        backgroundColor: '#ECFDF5',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    miniTitle: {
        fontWeight: '600',
        color: '#065F46',
        fontSize: 16,
        marginBottom: 4,
    },
    miniSub: {
        color: '#10B981',
        fontSize: 12,
        textAlign: 'center',
    },
    logoutBtn: {
        marginTop: 8,
        padding: 14,
        backgroundColor: '#F87171',
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});


// end of Dashboard