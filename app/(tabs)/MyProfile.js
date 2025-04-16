//MyProfile

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch, ScrollView, StyleSheet, Image } from 'react-native';
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

    async function updateTopicLevel(topicId, newLevel) {
        try {
            const res = await axios.put('/api/user/topics-levels', { topicId, newLevel });
            if (res.data.success) {
                alert(`עודכן רמה ל-${newLevel} בנושא: ${topicNames[topicId]}`);
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
                <Pressable onPress={handleGoToDashboard} style={styles.backButton}>
                    <Text style={styles.backButtonText}>⬅ חזרה לעמוד הבית </Text>
                </Pressable>

                <View style={{flexDirection: "row-reverse", alignSelf:"flex-end"}}>
                <View style={styles.profileContainer}>

                    <Text style={styles.profileSectionTitle}>פרופיל אישי </Text>

                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} // כתובת ברירת מחדל
                            style={styles.avatarImage}
                        />


                        <Text style={styles.name}>{name}</Text>

                        <View style={{flexDirection:"row-reverse"}}>
                            <Text style={styles.subText}>
                                {role} <Text style={{ fontSize: 20 }}>•</Text> רמה {level}
                            </Text>

                        </View>
                        {isLoading ? (
                            <Text style={styles.loadingText}>טוען נתוני משתמש...</Text>
                        ) : (

                            <View style={styles.profileLabels}>
                                <FontAwesome name="envelope" size={14} color="#4F46E5" style={{ marginLeft: 8 }} />
                                <Text style={styles.label}>{email}</Text>
                            </View>
                        )}
                    </View>

                  <View>

                      <View style={{flexDirection:"row-reverse"}}>
                            <Text style={styles.sectionTitle}>שפת ממשק:</Text>
                            <Text style={styles.input} > עברית </Text>
                      </View>
                            <View style={styles.switchContainer}>
                                <Text style={styles.label}>הצגת פתרונות מודרכים:</Text>
                                <Switch value={detailedSolutions} onValueChange={setDetailedSolutions} />
                            </View>

                            <Pressable onPress={saveUserDataLocally} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>שמור שינויים</Text>
                            </Pressable>

                        </View>
                </View>
                    <View>
                        <View style={styles.statisticContainer}>
                         <Text style={styles.sectionTitle}>סטטיסטיקה</Text>
                            <View style={{flexDirection: "row-reverse"}}>
                                <View style={styles.statisticSquere}>
                                    <Text>   {level} </Text>
                                    <Text>רמה כללית </Text>


                                </View>


                                <View style={styles.statisticSquere}>
                                    <Text>   {totalExercises} </Text>
                                    <Text>סה"כ תרגילים </Text>


                                </View>

                                <View style={styles.statisticSquere}>
                                    <Text>   {totalMistakes} </Text>
                                    <Text>סה"כ שגיאות </Text>


                                </View>
                            </View>

                        </View>
                        <View style={styles.levelsContainer}>

                            <Text style={styles.sectionTitle}>רמות בכל נושא:</Text>
                            {topicLevels.map((t) => (
                                <View key={t.topicId} style={styles.topicRow}>
                                    <Text style={styles.topicText}>
                                        {t.topicName} : רמה {t.level}
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
                        </View>

                    </View>
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
        maxWidth: 600,
        marginRight:20
    },
    statisticContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: 900,
        alignSelf: 'flex-end',
        marginRight:20,
        marginBottom:20
    },

    levelsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: 900,
        alignSelf: 'flex-end',
        marginRight:20
    },

    statisticSquere: {
        backgroundColor: '#ADD8E6',
        borderRadius: 12,
        padding: 20,
        width: 200,
        textAlign:'center',
        alignItems: 'center',
        margin:50,
    },
    backButton: {
        marginBottom: 16,
        alignSelf: 'flex-start',
        marginLeft:15

    },
    backButtonText: {
        color: '#4F46E5',
        fontWeight: '600',
    },
    avatarWrapper: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarImage: {
        width: 140,
        height: 150,
        borderRadius: 100,
        resizeMode: 'cover',
        backgroundColor: '#ddd'

    },
    avatarText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop:20
    },
    subText: {
        color: '#555',
        marginBottom: 20,
        fontSize:16
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
    profileLabels: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        alignSelf:'flex-end',
        margin: 10,
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
        flexDirection: 'row-reverse',
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
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#4F46E5',
    },

    profileSectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 50,
        color: '#4F46E5',
        textAlign:'center',
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
