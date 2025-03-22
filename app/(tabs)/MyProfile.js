import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from '../../styles/styles';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

export default function MyProfile() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [level, setLevel] = useState(1);
    const [language, setLanguage] = useState('עברית');
    const [detailedSolutions, setDetailedSolutions] = useState(false);
    const [topicLevels, setTopicLevels] = useState([]);

    // נוסיף גם תרגילים ושגיאות
    const [totalExercises, setTotalExercises] = useState(0);
    const [totalMistakes, setTotalMistakes] = useState(0);

    useEffect(() => {
        fetchUserFromServer();
        fetchUserTopics();
    }, []);

    async function fetchUserFromServer() {
        try {
            const res = await axios.get('/api/user');
            if (res.data && res.data.success) {
                setName(`${res.data.firstName} ${res.data.lastName}`);
                setEmail(res.data.mail);
                setLevel(res.data.level || 1);
                setTotalExercises(res.data.totalExercises || 0);
                setTotalMistakes(res.data.totalMistakes || 0);
            }
        } catch (err) {
            console.log("Error fetching user info:", err);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchUserTopics() {
        try {
            const res = await axios.get('/api/user/topics-levels');
            if (res.data.success) {
                setTopicLevels(res.data.topics); // { topicId, level, topicName }
            }
        } catch (e) {
            console.log("Error fetchUserTopics:", e);
        }
    }

    async function updateTopicLevel(topicId, newLevel) {
        try {
            const res = await axios.put('/api/user/topics-levels', { topicId, newLevel });
            if (res.data.success) {
                alert(`עודכן רמה ל-${newLevel} בנושא ID=${topicId}`);
                fetchUserTopics();
            } else {
                alert("לא ניתן לעדכן רמה");
            }
        } catch (err) {
            console.log("Error updateTopicLevel:", err);
        }
    }

    function handleGoToDashboard() {
        router.push('/Dashboard');
    }

    function saveUserDataLocally() {
        alert("שינויים נשמרו (לוקלי בלבד)");
    }

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={styles.container}>
                <Pressable onPress={handleGoToDashboard} style={styles.backButton}>
                    <Text style={styles.backButtonText}>⬅ חזרה לדאשבורד</Text>
                </Pressable>

                <Text style={styles.title}>הפרופיל שלי</Text>

                {isLoading ? (
                    <Text style={styles.loadingText}>טוען נתוני משתמש...</Text>
                ) : (
                    <>
                        <Text style={styles.label}>שלום {name}!</Text>
                        <Text style={styles.label}>אימייל: {email}</Text>
                        <Text style={styles.label}>(רמת משתמש כללית ישנה: {level})</Text>

                        {/* מציגים ערכי תרגילים ושגיאות */}
                        {/*<Text style={[styles.label, { marginTop: 10 }]}>*/}
                        {/*    סה"כ תרגילים שפתרתי: {totalExercises}*/}
                        {/*</Text>*/}
                        {/*<Text style={styles.label}>*/}
                        {/*    סה"כ שגיאות שהיו לי: {totalMistakes}*/}
                        {/*</Text>*/}

                        <Text style={[styles.label, { marginTop: 10, fontWeight: 'bold' }]}>
                            רמת קושי בכל נושא:
                        </Text>
                        {topicLevels.map(t => (
                            <View
                                key={t.topicId}
                                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                            >
                                <Text style={{ fontSize: 16, marginRight: 10 }}>
                                    {t.topicName} (#{t.topicId}): רמה {t.level}
                                </Text>
                                {t.level > 1 && (
                                    <Pressable
                                        onPress={() => updateTopicLevel(t.topicId, t.level - 1)}
                                        style={{ backgroundColor: '#ddd', padding: 5, borderRadius: 5 }}
                                    >
                                        <Text style={{ color: 'blue' }}>הורד רמה</Text>
                                    </Pressable>
                                )}
                            </View>
                        ))}

                        <Text style={[styles.label, { marginTop: 10 }]}>שפת ממשק:</Text>
                        <TextInput
                            style={styles.input}
                            value={language}
                            editable={false}
                        />

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>הצגת פתרונות מודרכים:</Text>
                            <Switch
                                value={detailedSolutions}
                                onValueChange={setDetailedSolutions}
                            />
                        </View>

                        <Pressable onPress={saveUserDataLocally} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>שמור שינויים</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </ProtectedRoute>
    );
};
