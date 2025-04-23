import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Statistics() {
    const router = useRouter();
    const [overallStats, setOverallStats] = useState(null);
    const [topicStats, setTopicStats] = useState([]);
    const [loading, setLoading] = useState(true);

    function handleGoBack() {
        router.push('/Dashboard');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overallRes, topicRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/statistics'),
                    axios.get('http://localhost:8080/api/statistics/by-topic')
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

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>טוען סטטיסטיקות...</Text>
            </View>
        );
    }

    if (!overallStats) {
        return (
            <ProtectedRoute requireAuth={true}>

            <View style={styles.container}>
                <Text style={styles.title}>📊 סטטיסטיקה כללית</Text>
                <Text>לא קיימים עדיין נתונים להצגה.</Text>
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>🔙 חזרה למסך הראשי</Text>
                </Pressable>
            </View>
                </ProtectedRoute>

                );
    }

    const topicNames = {
        1: "חיבור",
        2: "חיסור",
        3: "כפל",
        4: "חילוק",
        5: "חיבור שברים",
        6: "חיסור שברים",
        7: "כפל שברים",
        8: "חילוק שברים"
    };

    const renderTopicItem = ({ item }) => (
        <ProtectedRoute requireAuth={true}>

        <View style={styles.topicCard}>
            <Text style={styles.topicText}>🧩 נושא: {topicNames[item.topicId]}</Text>
            <Text>ניסיונות בנושא : {item.totalAttempts}</Text>
            <Text>טעויות בנושא : {item.totalMistakes}</Text>
            <Text>
                אחוז ההצלחה בנושא:{" "}
                {item.successRate != null
                    ? item.successRate.toFixed(1) + "%"
                    : "אין נתונים"}
            </Text>
        </View>
            </ProtectedRoute>

            );

    return (
        <ProtectedRoute requireAuth={true}>

    <View style={styles.container}>

            <Text style={styles.title}>📊 סטטיסטיקה כללית (כלל המשתמשים)</Text>
            <Text>סה"כ ניסיונות שבוצעו על ידי כלל המשתמשים: {overallStats.totalAttempts}</Text>
            <Text>סה"כ טעויות שבוצעו: {overallStats.totalMistakes}</Text>
            <Text>
                אחוז ההצלחה הממוצע:{" "}
                {overallStats.successRate != null
                    ? overallStats.successRate.toFixed(2) + "%"
                    : "אין נתונים"}
            </Text>
            <Text>
                הנושא שבו המשתמשים מתקשים הכי הרבה:{" "}
                {overallStats.mostDifficultTopic != null
                    ? `נושא #${overallStats.mostDifficultTopic}`
                    : "אין נתונים"}
            </Text>
            <Text>
                הנושא שבו המשתמשים מצליחים הכי הרבה:{" "}
                {overallStats.easiestTopic != null
                    ? `נושא #${overallStats.easiestTopic}`
                    : "אין נתונים"}
            </Text>

            <Text style={[styles.title, { marginTop: 30 }]}>📚 סטטיסטיקה לפי נושא (כלל המשתמשים)</Text>

            {topicStats.length === 0 ? (
                <Text>אין נתונים לפי נושאים עדיין.</Text>
            ) : (
                <FlatList
                    data={topicStats}
                    keyExtractor={(item) => item.topicId.toString()}
                    renderItem={renderTopicItem}
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            )}

            <Pressable onPress={handleGoBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>🔙 חזרה למסך הראשי</Text>
            </Pressable>
        </View>
            </ProtectedRoute>

            );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,  // הגדלנו את הרווחים
        alignItems: 'center', // סידור התוכן במרכז
        backgroundColor: '#f4f6f9',  // צבע רקע בהיר
        maxWidth: 1200, // הוספנו מקסימום רוחב למחשב
        marginHorizontal: 'auto',  // יישור אוטומטי במרכז
    },
    title: {
        fontSize: 24,  // גודל פונט גדול יותר
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333', // צבע כהה יותר לקריאות טובה יותר
    },
    backButton: {
        marginTop: 30,  // יותר רווח
        padding: 14, // הגדלנו את הריפוד
        backgroundColor: '#2196F3',
        borderRadius: 8, // עגלנו את הקצוות
    },
    backButtonText: {
        color: 'white',
        fontSize: 18, // גודל פונט יותר גדול
    },
    topicCard: {
        backgroundColor: '#fff',
        padding: 20, // יותר ריפוד
        marginVertical: 12, // מרווח בין כרטיסים
        borderRadius: 12, // עגלנו את הקצוות
        width: '100%', // עדכון רוחב
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // הוספנו צללה לכל כרטיס
        marginBottom: 20, // רווח בין כרטיסים
    },
    topicText: {
        fontWeight: 'bold',
        fontSize: 18,  // גודל פונט יותר גדול
        marginBottom: 8,
        color: '#444', // צבע טקסט כהה
    },
});