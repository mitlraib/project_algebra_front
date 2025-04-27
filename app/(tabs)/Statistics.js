import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeButton } from './Utils';


const Colors = {
    primary: '#8b5cf6',
    accent: '#fb923c',
    background: '#f8f6ff',
    light: '#ede9fe',
    secondary: '#7c3aed',
    success: '#10B981',
    danger: '#EF4444',
};

export default function Statistics() {
    const router = useRouter();
    const [overallStats, setOverallStats] = useState(null);
    const [topicStats, setTopicStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overallRes, topicRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/statistics'),
                    axios.get('http://localhost:8080/api/statistics/by-topic'),
                ]);
                setOverallStats(overallRes.data);
                setTopicStats(topicRes.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    function handleGoBack() {
        router.push('/Dashboard');
    }

    const topicNames = {
        1: 'חיבור',
        2: 'חיסור',
        3: 'כפל',
        4: 'חילוק',
        5: 'חיבור שברים',
        6: 'חיסור שברים',
        7: 'כפל שברים',
        8: 'חילוק שברים',
    };

    const renderTopicItem = ({ item }) => (
        <LinearGradient colors={['#ede9fe', '#ddd6fe']} style={styles.topicCard}>
            <Feather name="bar-chart" size={26} color={Colors.primary} style={{ marginBottom: 6 }} />
            <Text style={styles.topicTitle}>🧩 {topicNames[item.topicId]}</Text>
            <Text style={styles.topicStat}>ניסיונות: {item.totalAttempts}</Text>
            <Text style={styles.topicStat}>טעויות: {item.totalMistakes}</Text>
            <Text style={styles.topicStat}>
                אחוז הצלחה: {item.successRate != null ? item.successRate.toFixed(1) + '%' : 'אין נתונים'}
            </Text>
        </LinearGradient>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>טוען סטטיסטיקות...</Text>
            </View>
        );
    }

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={styles.container}>
                <HomeButton />

                <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.gradientTitleBox}>
                    <Text style={styles.pageTitle}>📊 סטטיסטיקה כללית (כלל המשתמשים)</Text>
                </LinearGradient>
                <View style={styles.cardContainer}>
                    <Text style={styles.infoText}>סה"כ ניסיונות: {overallStats.totalAttempts}</Text>
                    <Text style={styles.infoText}>סה"כ טעויות: {overallStats.totalMistakes}</Text>
                    <Text style={styles.infoText}>
                        אחוז הצלחה ממוצע: {overallStats.successRate != null ? overallStats.successRate.toFixed(2) + '%' : 'אין נתונים'}
                    </Text>
                    <Text style={styles.infoText}>
                        הנושא הקשה ביותר: {overallStats.mostDifficultTopic != null ? `נושא #${overallStats.mostDifficultTopic}` : 'אין נתונים'}
                    </Text>
                    <Text style={styles.infoText}>
                        הנושא הקל ביותר: {overallStats.easiestTopic != null ? `נושא #${overallStats.easiestTopic}` : 'אין נתונים'}
                    </Text>
                </View>

                <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.gradientTitleBox}>
                    <Text style={styles.pageTitle}>📚 סטטיסטיקה לפי נושא</Text>
                </LinearGradient>

                <FlatList
                    data={topicStats}
                    keyExtractor={(item) => item.topicId.toString()}
                    renderItem={renderTopicItem}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    style={{ width: '100%' }}
                />

            </View>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    gradientTitleBox: {
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 30,
        width: '100%',
    },
    infoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        marginBottom: 6,
        textAlign: 'center',
    },
    topicCard: {
        padding: 20,
        borderRadius: 20,
        marginVertical: 8,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    topicTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.secondary,
        marginBottom: 8,
    },
    topicStat: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: Colors.secondary,
        textAlign: 'center',
    },
    backButton: {
        marginTop: 24,
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 100,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});