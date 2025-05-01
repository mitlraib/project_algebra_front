import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, ActivityIndicator, ScrollView,} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import ProtectedRoute from '../../components/ProtectedRoute';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeButton } from '../../src/utils/Utils';
import { Colors } from '../../constants/Colors';
import {statisticsStyles} from '../../styles/styles'
import { api } from  '../../components/api';


export default function Statistics() {
    const router = useRouter();
    const [overallStats, setOverallStats] = useState(null);
    const [topicStats, setTopicStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overallRes, topicRes] = await Promise.all([

                    api.get('/api/statistics'),
                    api.get('/api/statistics/by-topic')
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
        <LinearGradient colors={[Colors.light, Colors.grayish]} style={statisticsStyles.topicCard}>
            <Feather name="bar-chart" size={26} color={Colors.primary} style={{ marginBottom: 6 }} />
            <Text style={statisticsStyles.topicTitle}>🧩 {topicNames[item.topicId]}</Text>
            <Text style={statisticsStyles.topicStat}>ניסיונות: {item.totalAttempts}</Text>
            <Text style={statisticsStyles.topicStat}>טעויות: {item.totalMistakes}</Text>
            <Text style={statisticsStyles.topicStat}>
                אחוז הצלחה: {item.successRate != null ? item.successRate.toFixed(1) + '%' : 'אין נתונים'}
            </Text>
        </LinearGradient>
    );

    if (loading) {
        return (
            <View style={statisticsStyles.container}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={statisticsStyles.loadingText}>טוען סטטיסטיקות...</Text>
            </View>
        );
    }

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={statisticsStyles.container}>
                <ScrollView contentContainerStyle={statisticsStyles.scrollView}>
                <HomeButton />

                <LinearGradient colors={[Colors.primary, Colors.accent]}
                                style={[statisticsStyles.gradientTitleBox,{marginTop:100}
                    ]}>
                    <Text style={statisticsStyles.pageTitle}>📊 סטטיסטיקה כללית (כלל המשתמשים)</Text>
                </LinearGradient>
                <View style={statisticsStyles.cardContainer}>
                    <Text style={statisticsStyles.infoText}>סה"כ ניסיונות: {overallStats.totalAttempts}</Text>
                    <Text style={statisticsStyles.infoText}>סה"כ טעויות: {overallStats.totalMistakes}</Text>
                    <Text style={statisticsStyles.infoText}>
                        אחוז הצלחה ממוצע: {overallStats.successRate != null ? overallStats.successRate.toFixed(2) + '%' : 'אין נתונים'}
                    </Text>
                    <Text style={statisticsStyles.infoText}>
                        הנושא הקשה ביותר: {overallStats.mostDifficultTopic != null ? `נושא #${overallStats.mostDifficultTopic}` : 'אין נתונים'}
                    </Text>
                    <Text style={statisticsStyles.infoText}>
                        הנושא הקל ביותר: {overallStats.easiestTopic != null ? `נושא #${overallStats.easiestTopic}` : 'אין נתונים'}
                    </Text>
                </View>

                <LinearGradient colors={[Colors.primary, Colors.accent]} style={statisticsStyles.gradientTitleBox}>
                    <Text style={statisticsStyles.pageTitle}>📚 סטטיסטיקה לפי נושא</Text>
                </LinearGradient>

                <FlatList
                    data={topicStats}
                    keyExtractor={(item) => item.topicId.toString()}
                    renderItem={renderTopicItem}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    style={{ width: '100%' }}
                />
                </ScrollView>
            </View>
        </ProtectedRoute>
    );
}

