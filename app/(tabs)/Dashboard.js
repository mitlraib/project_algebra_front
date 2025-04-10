// Dashboard

import React, {useEffect, useState} from 'react';
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
import axios from "axios";

export default function Dashboard() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false); // מצב אם המשתמש הוא מנהל
    const [loading, setLoading] = useState(true); // מצב טעינה
    const [progressData, setProgressData] = useState({
        stars: 0,
        level: 0,
        progress: 0,
    });

    useEffect(() => {

        const token = Cookies.get('userToken');
        if (!token) {
            router.replace('/authentication/Login');
        }
        // אם יש token, נוודא שהמשתמש הוא מנהל
        axios.get('/api/user', { withCredentials: true })
            .then(response => {
                const data = response.data;
                if (data.success && data.role?.toUpperCase() === "ADMIN") {
                    setIsAdmin(true);  // אם הוא מנהל, עדכון ה-state
                } else {
                    setIsAdmin(false); // אם לא מנהל, לא נציג את הכפתור
                }
                const { level, totalExercises, totalMistakes } = response.data;
                const correctAnswers = totalExercises - totalMistakes;
                const progress = totalExercises > 0 ? correctAnswers / totalExercises : 0;
                setProgressData({
                    stars: correctAnswers,
                    level,
                    progress,
                });
            })
            .catch(error => {
                console.log("ERROR:", error);
                setIsAdmin(false); // במקרה של שגיאה, לא נציג את הכפתור
            })
            .finally(() => setLoading(false)); // סיום טעינה
    }, [router]);


    if (loading) {
        return <Text>טעינה...</Text>; // או קומפוננטת טעינה אם יש לך כזו
    }

    const handleLogout = async () => {
        try {
            // 1) קריאה לשרת כדי לנקות את הסשן
            await axios.post('/api/logout');
        } catch(e) {
            console.log('Logout error:', e);
            // לא חייבים לעצור אם נכשל
        }
        // 2) מחיקת קוקיות משלך (אם את צריכה)
        Cookies.remove('userToken');

        // 3) הפנייה למסך login
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

                        {/* הסבר על המשמעות של ההתקדמות */}
                        <Text style={styles.progressDescription}>
                            {progressData.progress < 0.3 ?
                                "אתה בתחילת הדרך! המשך ללמוד כדי להשתפר." :
                                progressData.progress < 0.6 ?
                                    " אתה בדרך הנכונה." :
                                    " כל הכבוד על ההתקדמות המרשימה!"}
                        </Text>

                        <Text style={styles.progressText}>
                            <FontAwesome name="check-circle" size={18} color="#4F46E5" /> {/* סימן מגניב */}
                            {` הצלחת ב-${(progressData.progress * 100).toFixed(0)}% מהשאלות`}
                        </Text>

                            {/* מד ההתקדמות */}
                            <ProgressBar progress={progressData.progress} color="#4F46E5" style={styles.progress} />


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
                        {/* כפתור סטטיסטיקה, רק אם המשתמש הוא מנהל */}
                        {isAdmin && (
                            <TouchableOpacity style={styles.miniCard} onPress={() => router.push('/Statistics')}>
                                <Text style={styles.miniTitle}>סטטיסטיקה</Text>
                                <Text style={styles.miniSub}>מעקב אחרי ההתקדמות</Text>
                            </TouchableOpacity>
                        )}
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
    cardHeader: {
        flexDirection: 'column',
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
        marginBottom: 2,
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
    progressText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 4,
        marginBottom: 4,  // תוסיף מרווח בין הטקסטים כדי למנוע חפיפות
        textAlign: 'center',
    },
    progressDescription: {
        color: '#6B7280',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 4, // הוסף מרווח כדי למנוע חפיפות
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
        flexDirection: 'column',  // יש לוודא שהאלמנטים יהיו בסדר אנכי
        justifyContent: 'flex-start', // מוודא שהאלמנטים ממוקמים מלמעלה
        alignItems: 'center',  // ליישר את התוכן במרכז (אופציונלי)
    }
});

// end of Dashboard