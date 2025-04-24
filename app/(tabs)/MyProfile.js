//MyProfile

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {myProfileStyles} from '../../styles/styles'
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
            <ScrollView contentContainerStyle={myProfileStyles.scrollContainer}>
                <Pressable onPress={handleGoToDashboard} style={myProfileStyles.backButton}>
                    <Text style={myProfileStyles.backButtonText}>⬅ חזרה לעמוד הבית </Text>
                </Pressable>

                <View style={{flexDirection: "row-reverse", alignSelf:"flex-end"}}>
                <View style={myProfileStyles.profileContainer}>

                    <Text style={myProfileStyles.profileSectionTitle}>פרופיל אישי </Text>

                    <View style={myProfileStyles.avatarWrapper}>
                        <FontAwesome name="user" size={100} color="#6366F1" />
                    </View>
                    <View style={{alignSelf:"center"}}>
                        <Text style={myProfileStyles.name}>{name}</Text>

                        <View style={{flexDirection:"row-reverse"}}>
                            <Text style={myProfileStyles.subText}>
                                {role} <Text style={{ fontSize: 20 }}>•</Text> רמה {level}
                            </Text>
                        </View>

                        </View>
                        {isLoading ? (
                            <Text style={myProfileStyles.loadingText}>טוען נתוני משתמש...</Text>
                        ) : (

                            <View style={myProfileStyles.profileLabels}>
                                <FontAwesome name="envelope" size={14} color="#4F46E5" style={{ marginLeft: 8, marginTop:5, marginBottom:30 }} />
                                <Text style={myProfileStyles.label}>{email}</Text>
                            </View>
                        )}

                  <View>
                      <Pressable onPress={()=>{alert("מצטערים, כרגע אנחנו תומכים רק בעברית....")}}>

                      <View style={{flexDirection:"row-reverse"}} >
                            <Text style={{fontSize:16, padding:5}}>שפת ממשק:</Text>
                          <FontAwesome name="language" size={25} color="#6366F1" style={{paddingRight:10}}/>
                          <Text style={myProfileStyles.input} > עברית </Text>
                      </View>
                      </Pressable>

                      <View style={myProfileStyles.switchContainer}>
                                <Text style={myProfileStyles.label}>הצגת פתרונות מודרכים:</Text>
                          <Switch value={detailedSolutions}
                                  onValueChange={setDetailedSolutions} />                            </View>

                            <Pressable onPress={saveChanges} style={myProfileStyles.saveButton}>
                                <Text style={myProfileStyles.saveButtonText}>שמור שינויים</Text>
                            </Pressable>

                        </View>
                </View>
                    <View>
                        <View style={myProfileStyles.statisticContainer}>
                         <Text style={myProfileStyles.sectionTitle}> סטטיסטיקה אישית</Text>
                            <View style={{flexDirection: "row-reverse"}}>
                                <LinearGradient
                                    colors={['#bfd4eb', '#e3e7f4']} // כהה → בהיר כמו בתמונה שלך
                                    style={myProfileStyles.statisticSquere}
                                >
                                    <View style={myProfileStyles.iconBox}>

                                    <FontAwesome name="user" size={25} color="#6366F1" />
                            </View>
                                    <Text style={{ color: '#000', fontSize: 24 , fontWeight:"bold", marginRight:5}}> {level}</Text>
                                    <Text style={{ color: '#000', fontSize: 16 }}> רמה כללית </Text>

                                </LinearGradient>


                                <LinearGradient
                                    colors={['#bfd4eb', '#e3e7f4']} // כהה → בהיר כמו בתמונה שלך
                                    style={myProfileStyles.statisticSquere}
                                >
                                    <View style={myProfileStyles.iconBox}>

                                    <Feather name="book-open" size={25} color="#6366F1" />
                                    </View>
                                    <Text style={{ color: '#000', fontSize: 24 , fontWeight:"bold", marginRight:5}}> {totalExercises}</Text>
                                    <Text style={{ color: '#000', fontSize: 16 }}> סה"כ תרגילים </Text>

                                </LinearGradient>



                                <LinearGradient
                                    colors={['#bfd4eb', '#e3e7f4']} // כהה → בהיר כמו בתמונה שלך
                                    style={myProfileStyles.statisticSquere}
                                >
                                    <View style={myProfileStyles.iconBox}>
                                    <FontAwesome name="info-circle" size={25} color="#6366F1" />
                                    </View>

                                    <Text style={{ color: '#000', fontSize: 24 , fontWeight:"bold", marginRight:5}}> {totalMistakes}</Text>
                                    <Text style={{ color: '#000', fontSize: 16 }}> סה"כ שגיאות </Text>

                                </LinearGradient>
                            </View>

                        </View>
                        <View style={myProfileStyles.levelsContainer}>

                            <Text style={myProfileStyles.sectionTitle}>רמות בכל נושא:</Text>
                            {topicLevels.map((t) => (
                                <View key={t.topicId} style={myProfileStyles.topicRow}>
                                    <TopicProgressBar
                                        key={t.topicId}
                                        topicName={t.topicName}
                                        level={t.level}
                                    />
                                    <Text style={myProfileStyles.topicText}>
                                        {t.topicName} : רמה {t.level}
                                    </Text>
                                    {t.level > 1 && (
                                        <Pressable
                                            onPress={() => updateTopicLevel(t.topicId, t.level - 1)}
                                            style={myProfileStyles.lowerButton}
                                        >
                                            <Text style={myProfileStyles.lowerButtonText}>הורד רמה</Text>
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



//end of MyProfile
