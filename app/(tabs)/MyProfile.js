//MyProfile

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
    const [detailedSolutions, setDetailedSolutions] = useState(true);
    const [topicLevels, setTopicLevels] = useState([]);
    const [totalExercises, setTotalExercises] = useState(0);
    const [totalMistakes, setTotalMistakes] = useState(0);
    const [origDetailedSolutions, setOrigDetailedSolutions] = useState(true);

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
                setDetailedSolutions(res.data.detailedSolutions);
                setOrigDetailedSolutions(res.data.detailedSolutions);
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

    async function saveChanges() {
        if (detailedSolutions !== origDetailedSolutions) {
            try {
                await axios.put("/api/user/preferences", { detailedSolutions });
                setOrigDetailedSolutions(detailedSolutions);      // מעדכן נק’ ייחוס חדשה
                alert("ההעדפה נשמרה ✔");
            } catch (e) {
                alert("❌  שמירה נכשלה");
            }
        } else {
            alert("לא בוצעו שינויים");
        }
    }

    const TopicProgressBar = ({ topicName, level }) => {
        const percentage = Math.min((level / 10) * 100, 10); // מבטיח שלא יעבור 10
        return (
            <View style={{ marginBottom: 12 }}>
                <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
                    {`${level}/10`} - {topicName}
                </Text>
                <View style={{
                    height: 15,
                    width:500,
                    backgroundColor: '#e3e7f4',
                    borderRadius: 10,
                    overflow: 'hidden',
                    flexDirection: 'row'
                }}>
                    <View style={{
                        width: `${percentage}%`,
                        backgroundColor: '#818cf8',
                        borderRadius: 10
                    }} />
                </View>
            </View>
        );
    };


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
                        <FontAwesome name="user" size={100} color="#6366F1" />
                    </View>
                    <View style={{alignSelf:"center"}}>
                        <Text style={styles.name}>{name}</Text>

                        <View style={{flexDirection:"row-reverse"}}>
                            <Text style={styles.subText}>
                                {role} <Text style={{ fontSize: 20 }}>•</Text> רמה {level}
                            </Text>
                        </View>

                        </View>
                        {isLoading ? (
                            <Text style={styles.loadingText}>טוען נתוני משתמש...</Text>
                        ) : (

                            <View style={styles.profileLabels}>
                                <FontAwesome name="envelope" size={14} color="#4F46E5" style={{ marginLeft: 8, marginTop:5, marginBottom:30 }} />
                                <Text style={styles.label}>{email}</Text>
                            </View>
                        )}

                  <View>
                      <Pressable onPress={()=>{alert("מצטערים, כרגע אנחנו תומכים רק בעברית....")}}>

                      <View style={{flexDirection:"row-reverse"}} >
                            <Text style={{fontSize:16, padding:5}}>שפת ממשק:</Text>
                          <FontAwesome name="language" size={25} color="#6366F1" style={{paddingRight:10}}/>
                          <Text style={styles.input} > עברית </Text>
                      </View>
                      </Pressable>

                      <View style={styles.switchContainer}>
                                <Text style={styles.label}>הצגת פתרונות מודרכים:</Text>
                          <Switch value={detailedSolutions}
                                  onValueChange={setDetailedSolutions} />                            </View>

                            <Pressable onPress={saveChanges} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>שמור שינויים</Text>
                            </Pressable>

                        </View>
                </View>
                    <View>
                        <View style={styles.statisticContainer}>
                         <Text style={styles.sectionTitle}>סטטיסטיקה</Text>
                            <View style={{flexDirection: "row-reverse"}}>
                                <LinearGradient
                                    colors={['#bfd4eb', '#e3e7f4']} // כהה → בהיר כמו בתמונה שלך
                                    style={styles.statisticSquere}
                                >
                                    <View style={styles.iconBox}>

                                    <FontAwesome name="user" size={25} color="#6366F1" />
                            </View>
                                    <Text style={{ color: '#000', fontSize: 24 , fontWeight:"bold", marginRight:5}}> {level}</Text>
                                    <Text style={{ color: '#000', fontSize: 16 }}> רמה כללית </Text>

                                </LinearGradient>


                                <LinearGradient
                                    colors={['#bfd4eb', '#e3e7f4']} // כהה → בהיר כמו בתמונה שלך
                                    style={styles.statisticSquere}
                                >
                                    <View style={styles.iconBox}>

                                    <Feather name="book-open" size={25} color="#6366F1" />
                                    </View>
                                    <Text style={{ color: '#000', fontSize: 24 , fontWeight:"bold", marginRight:5}}> {totalExercises}</Text>
                                    <Text style={{ color: '#000', fontSize: 16 }}> סה"כ תרגילים </Text>

                                </LinearGradient>



                                <LinearGradient
                                    colors={['#bfd4eb', '#e3e7f4']} // כהה → בהיר כמו בתמונה שלך
                                    style={styles.statisticSquere}
                                >
                                    <View style={styles.iconBox}>
                                    <FontAwesome name="info-circle" size={25} color="#6366F1" />
                                    </View>

                                    <Text style={{ color: '#000', fontSize: 24 , fontWeight:"bold", marginRight:5}}> {totalMistakes}</Text>
                                    <Text style={{ color: '#000', fontSize: 16 }}> סה"כ שגיאות </Text>

                                </LinearGradient>
                            </View>

                        </View>
                        <View style={styles.levelsContainer}>

                            <Text style={styles.sectionTitle}>רמות בכל נושא:</Text>
                            {topicLevels.map((t) => (
                                <View key={t.topicId} style={styles.topicRow}>
                                    <TopicProgressBar
                                        key={t.topicId}
                                        topicName={t.topicName}
                                        level={t.level}
                                    />
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
        backgroundColor: '#8F9CB3',
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
        backgroundColor: '#e3e7f4', // תואם לרקע שבתמונה שלך
        borderRadius: 100,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        width: 170,
        height: 170,
        alignSelf:"center"
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
        textAlign:"right",
        margin: 10,
    },

    input: {
        fontSize: 18,
        paddingTop:2
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
    iconBox: {
        backgroundColor: '#e3e7f4', // תואם לרקע שבתמונה שלך
        borderRadius: 60,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        width: 50,
        height: 50,
    }

});


//end of MyProfile
