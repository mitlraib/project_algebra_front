// /app/(tabs)/Dashboard
import React, { useEffect, useState, useRef } from 'react';
import {View, Text, TouchableOpacity, Image,ScrollView, Animated,} from 'react-native';
import { useRouter } from 'expo-router';
import { ProgressBar } from 'react-native-paper';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProtectedRoute from '../../components/ProtectedRoute';
import  storage  from '../utils/storage';
import {dashboardStyles} from '../../styles/styles'
import { Colors } from '../../constants/Colors';
import  api  from  '../../src/api/axiosConfig';


export default function Dashboard() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progressData, setProgressData] = useState({ stars: 0, level: 0, progress: 0 });
    const [username, setUsername] = useState('');

    const pulseAnim = useRef(new Animated.Value(1)).current;

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

    }, []);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                console.time("⏱️ getUser");

                const token = await storage.get('userToken');
                if (!token) {
                    if (isMounted) router.replace('/authentication/Login');
                    return;
                }

                const { data } = await api.get('/api/user');
                console.log("👤 קיבלתי את פרטי המשתמש:", data);
                console.timeEnd("⏱️ getUser");

                if (!isMounted) return;
                setIsAdmin(data.success && data.role?.toUpperCase() === 'ADMIN');

                const { level, totalExercises, totalMistakes } = data;
                const correct     = totalExercises - totalMistakes;
                const progressPct = totalExercises > 0 ? correct / totalExercises : 0;
                setProgressData({ stars: correct, level, progress: progressPct });
                setUsername(data.firstName ); // או data.username אם זה השדה

            } catch (err) {
                console.timeEnd("⏱️ getUser");
                console.error("❌ שגיאה ב־getUser:", err);
                if (isMounted) setIsAdmin(false);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();

        return () => { isMounted = false; };
    }, []);





    if (loading) {
        return <Text>טעינה...</Text>;
    }

    const handleLogout = async () => {

        await storage.remove('userToken');        // מוחקים את הטוקן מהמכשיר
        router.replace('/authentication/Login');  // חזרה למסך התחברות
    };



    return (

        <ProtectedRoute requireAuth={true}>
            <ScrollView>
            <View contentContainerStyle={dashboardStyles.scrollContainer}>
                <View style={dashboardStyles.header}>
                    {/* לוגו מצד שמאל */}
                    <Text style={dashboardStyles.logo}>
                        <Text style={dashboardStyles.mathColor}>Math</Text>
                        <Text style={dashboardStyles.JourneyColor}>Journey</Text>
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
                    <Text
                        style={[dashboardStyles.gradientTitle, { writingDirection: 'rtl' }]}
                    >
                        {username},  ברוך הבא ל־MathJourney!
                    </Text>
                </LinearGradient>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={dashboardStyles.rowWrapper}>
                    {isAdmin && (
                        <View style={dashboardStyles.box}>
                            <View style={dashboardStyles.iconCircle}>
                                <Feather name="pie-chart" size={24} color={Colors.accent} />
                            </View>
                            <Text style={dashboardStyles.title}>סטטיסטיקה</Text>
                            <Text style={dashboardStyles.statisticsDescription}>סטטיסטיקה למנהלים בלבד !</Text>
                            <TouchableOpacity style={dashboardStyles.statisticsButton} onPress={() => router.push('admin/Statistics')}>
                                <Text style={dashboardStyles.statisticsButtonText}> סטטיסטיקה כללית </Text>
                            </TouchableOpacity>
                        </View>

                    )}

                    {/* ריבוע בצד שמאל */}
                    <View style={dashboardStyles.columnWrapper}>
                    <View style={dashboardStyles.box}>
                        <View style={dashboardStyles.iconCircle}>
                            <Feather name="watch" size={24} color={Colors.accent} />
                        </View>
                        <Text style={dashboardStyles.title}>אימון מרתון</Text>
                        <Text style={dashboardStyles.marathonDescription}>אימון מהיר על כל החומר על פי רמתך</Text>

                        <TouchableOpacity
                            style={dashboardStyles.marathonButton}
                            onPress={() => router.push('/course/random?id=random')}
                        >
                            <Text style={dashboardStyles.marathonButtonText}>אימון שאלות רנדומליות</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={dashboardStyles.box}>
                        <View style={dashboardStyles.iconCircle}>
                            <Feather name="award" size={24} color={Colors.accent} />
                        </View>
                        <Text style={dashboardStyles.title}> הישגים</Text>
                        <Text style={dashboardStyles.achievementsDescription}>כל ההישגים שצברת עד כה  </Text>

                        <TouchableOpacity
                            style={dashboardStyles.achievementsButton}
                            onPress={() => router.push('/Achievements')}
                        >
                            <Text style={dashboardStyles.achievementsButtonText}>הישגים</Text>
                        </TouchableOpacity>
                    </View>
                    </View>

                    {/* כל התוכן בתוך mainCard בצד ימין */}
                    <View style={dashboardStyles.mainCard}>
                        <View style={dashboardStyles.mainBCard}>

                            <View style={dashboardStyles.titleWrapper}>
                        <Text style={dashboardStyles.title}>
                            האתר שלנו נועד לעזור לך ללמוד חשבון בצורה חכמה ומהנה, עם שאלות מותאמות אישית והתקדמות לפי היכולת שלך.
                        </Text>
                            </View>
                        <Image
                            source={require('../../assets/images/learning-math.jpg')}
                            style={dashboardStyles.imageStyle}
                        />
                        <View style={{flexDirection: 'row-reverse', justifyContent: 'space-between',}}>
                        <Text style={dashboardStyles.greetingText}>שלום! </Text>

                        <View>
                            <Animated.View style={[dashboardStyles.emojiCircle, { transform: [{ scale: pulseAnim }] }]}>
                                <Text style={dashboardStyles.emoji}>👋</Text>
                            </Animated.View>
                        </View>

                        <Text style={dashboardStyles.greetingText}> מוכנים ללמוד חשבון?</Text>
                        </View>
                        <View style={dashboardStyles.cardContainer}>
                            <View>
                                <View style={{flexDirection:'row-reverse', justifyContent:'center'}}>
                                <Text style={dashboardStyles.title}>
                                    {progressData.progress < 0.3
                                        ? "אתה בתחילת הדרך! תלמד כדי להשתפר..."
                                        : progressData.progress < 0.6
                                            ? " אתה בדרך הנכונה!"
                                            : " כל הכבוד !"}
                                </Text>
                                </View>
                                <View>
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
                                <Feather name="play" size={18} color="#fff" />
                                <Text style={dashboardStyles.buttonText}>התחל תרגול</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Mini cards */}
                        <View style={dashboardStyles.grid}>



                        </View>
                    </View>
                    </View>
                </View>
                </View>

            </View>
            </ScrollView>
        </ProtectedRoute>
    );
}


