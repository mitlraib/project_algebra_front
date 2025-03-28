//MyProfile

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FontAwesome } from '@expo/vector-icons';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

export default function MyProfile() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [level, setLevel] = useState(1);
    const [role, setRole] = useState();
    const [language, setLanguage] = useState('עברית');
    const [detailedSolutions, setDetailedSolutions] = useState(false);
    const [topicLevels, setTopicLevels] = useState([]);
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
                setRole(res.data.role);
                setTotalExercises(res.data.totalExercises || 0);
                setTotalMistakes(res.data.totalMistakes || 0);
            }
        } catch (err) {
            console.log('Error fetching user info:', err);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchUserTopics() {
        try {
            const res = await axios.get('/api/user/topics-levels');
            if (res.data.success) {
                setTopicLevels(res.data.topics);
            }
        } catch (e) {
            console.log('Error fetchUserTopics:', e);
        }
    }

    async function updateTopicLevel(topicId, newLevel) {
        try {
            const res = await axios.put('/api/user/topics-levels', { topicId, newLevel });
            if (res.data.success) {
                alert(`עודכן רמה ל-${newLevel} בנושא ID=${topicId}`);
                fetchUserTopics();
            } else {
                alert('לא ניתן לעדכן רמה');
            }
        } catch (err) {
            console.log('Error updateTopicLevel:', err);
        }
    }

    function handleGoToDashboard() {
        router.push('/Dashboard');
    }

    function saveUserDataLocally() {
        alert('שינויים נשמרו (לוקלי בלבד)');
    }

    return (
        <ProtectedRoute requireAuth={true}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.profileContainer}>
                    <Pressable onPress={handleGoToDashboard} style={styles.backButton}>
                        <Text style={styles.backButtonText}>⬅ חזרה לדאשבורד</Text>
                    </Pressable>

                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.subText}>רמה {level}</Text>
                    </View>

                    {isLoading ? (
                        <Text style={styles.loadingText}>טוען נתוני משתמש...</Text>
                    ) : (
                        <>
                            <View style={styles.card}>
                                <Text style={styles.label}>אימייל: {email}</Text>
                                <Text style={styles.label}>תפקיד: {role}</Text>
                                <Text style={styles.label}>סה"כ תרגילים: {totalExercises}</Text>
                                <Text style={styles.label}>סה"כ שגיאות: {totalMistakes}</Text>
                            </View>

                            <Text style={styles.sectionTitle}>רמות בכל נושא:</Text>
                            {topicLevels.map((t) => (
                                <View key={t.topicId} style={styles.topicRow}>
                                    <Text style={styles.topicText}>
                                        {t.topicName} (#{t.topicId}): רמה {t.level}
                                    </Text>
                                    {t.level > 1 && (
                                        <Pressable
                                            onPress={() => updateTopicLevel(t.topicId, t.level - 1)}
                                            style={styles.lowerButton}
                                        >
                                            <Text style={styles.lowerButtonText}>הורד רמה</Text>
                                        </Pressable>
                                    )}
                                </View>
                            ))}

                            <Text style={styles.sectionTitle}>שפת ממשק:</Text>
                            <TextInput style={styles.input} value={language} editable={false} />

                            <View style={styles.switchContainer}>
                                <Text style={styles.label}>הצגת פתרונות מודרכים:</Text>
                                <Switch value={detailedSolutions} onValueChange={setDetailedSolutions} />
                            </View>

                            <Pressable onPress={saveUserDataLocally} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>שמור שינויים</Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </ScrollView>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    profileContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxWidth: 700,
        alignSelf: 'center',
    },
    backButton: {
        marginBottom: 16,
    },
    backButtonText: {
        color: '#4F46E5',
        fontWeight: '600',
    },
    avatarWrapper: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 8,
    },
    subText: {
        color: '#555',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
    },
    saveButton: {
        backgroundColor: '#4F46E5',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#111',
    },
    topicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    topicText: {
        fontSize: 16,
        flex: 1,
    },
    lowerButton: {
        backgroundColor: '#E5E7EB',
        padding: 6,
        borderRadius: 6,
        marginLeft: 10,
    },
    lowerButtonText: {
        color: '#2563EB',
        fontWeight: '500',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
    },
});


//end of MyProfile
