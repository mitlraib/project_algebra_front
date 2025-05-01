//MyProfile

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {myProfileStyles} from '../../styles/styles';
import { HomeButton } from '../../src/utils/Utils';
import { Colors } from '../../constants/Colors';
import { api } from  'components/api';


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

    const personalStats = [
        {
            id: 'level',
            iconFamily: FontAwesome,
            iconName: 'user',
            iconColor: Colors.primary,
            amount: level,
            caption: 'רמה כללית',
            colors: [Colors.light, Colors.grayish],
        },
        {
            id: 'exercises',
            iconFamily: Feather,
            iconName: 'book-open',
            iconColor: Colors.primary,
            amount: totalExercises,
            caption: 'סה"כ תרגילים',
            colors: [Colors.light, Colors.grayish],
        },
        {
            id: 'mistakes',
            iconFamily: FontAwesome,
            iconName: 'info-circle',
            iconColor: '#8b5cf6',
            amount: totalMistakes,
            caption: 'סה"כ שגיאות',
            colors: ['#ede9fe', '#f5f3ff'],
        },
    ];



    useEffect(() => {
        fetchUserFromServer();
        fetchUserTopics();
    }, []);

    async function fetchUserFromServer() {
        try {
            const res = await api.get('/api/user');
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
            const res = await api.get('/api/user/topics-levels');
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
            const res = await api.put('/api/user/topics-levels', { topicId, newLevel });
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

    async function saveChanges() {
        if (detailedSolutions !== origDetailedSolutions) {
            try {
                await api.put("/api/user/preferences", { detailedSolutions });
                setOrigDetailedSolutions(detailedSolutions);
                alert("ההעדפה נשמרה ✔");
            } catch (e) {
                alert("❌  שמירה נכשלה");
            }
        } else {
            alert("לא בוצעו שינויים");
        }
    }

    const TopicProgressBar = ({ topicName, level }) => {
        const percentage = Math.min((level / 10) * 100, 100);
        return (
            <View style={{ marginBottom: 12 }}>
                <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
                    {`${level}/10`} - {topicName}
                </Text>
                <View style={{
                    height: 15,
                    width: 500,
                    backgroundColor: Colors.grayish,
                    borderRadius: 10,
                    overflow: 'hidden',
                    flexDirection: 'row'
                }}>
                    <View style={{
                        width: `${percentage}%`,
                        backgroundColor: Colors.primary,
                        borderRadius: 10
                    }} />
                </View>
            </View>
        );
    };

    return (
        <ProtectedRoute requireAuth={true}>
            <ScrollView contentContainerStyle={myProfileStyles.scrollContainer}>

                <HomeButton />

                <View style={{ flexDirection: "row-reverse", alignSelf: "flex-end" }}>
                    <View style={myProfileStyles.profileContainer}>
                        <Text style={myProfileStyles.profileSectionTitle}>פרופיל אישי </Text>
                        <View style={myProfileStyles.avatarWrapper}>
                            <FontAwesome name="user" size={100} color= {Colors.primary} />
                        </View>
                        <View style={{ alignSelf: "center" }}>
                            <Text style={myProfileStyles.name}>{name}</Text>
                            <View style={{ flexDirection: "row-reverse" }}>
                                <Text style={myProfileStyles.subText}>
                                    {role} <Text style={{ fontSize: 20 }}>•</Text> רמה {level}
                                </Text>
                            </View>
                        </View>
                        {isLoading ? (
                            <Text style={myProfileStyles.loadingText}>טוען נתוני משתמש...</Text>
                        ) : (
                            <View style={myProfileStyles.profileLabels}>
                                <FontAwesome name="envelope" size={14} color={Colors.primary} style={{ marginLeft: 8, marginTop: 5, marginBottom: 30 }} />
                                <Text style={myProfileStyles.label}>{email}</Text>
                            </View>
                        )}

                        <View>
                            <Pressable onPress={() => { alert("מצטערים, כרגע אנחנו תומכים רק בעברית....") }}>
                                <View style={{ flexDirection: "row-reverse" }} >
                                    <Text style={myProfileStyles.languageLabel}>שפת ממשק:</Text>
                                    <FontAwesome name="language" size={25} color={Colors.primary} style={{ paddingRight: 10 }} />
                                    <Text style={myProfileStyles.input} > עברית </Text>
                                </View>
                            </Pressable>
                            <View style={myProfileStyles.switchContainer}>
                                <Text style={myProfileStyles.label}>הצגת פתרונות מודרכים:</Text>
                                <Switch value={detailedSolutions} onValueChange={setDetailedSolutions} />
                            </View>
                            <LinearGradient
                                colors={[Colors.primary, Colors.accent]}
                                style={myProfileStyles.saveButtonGradient}
                            >
                                <Pressable onPress={saveChanges}>
                                    <Text style={myProfileStyles.buttonText}>שמור שינויים</Text>
                                </Pressable>
                            </LinearGradient>

                        </View>
                    </View>

                    <View>
                        <View style={myProfileStyles.statisticContainer}>
                            <View style={{ flexDirection: "row-reverse" }}>
                                {personalStats.map((stat) => (
                                    <LinearGradient key={stat.id} colors={stat.colors} style={myProfileStyles.statisticSquare}>
                                        <View style={myProfileStyles.iconBox}>
                                            <stat.iconFamily name={stat.iconName} size={25} color={stat.iconColor} />
                                        </View>
                                        <Text style={myProfileStyles.countInput}>{stat.amount}</Text>
                                        <Text style={myProfileStyles.countDescription}>{stat.caption}</Text>
                                    </LinearGradient>
                                ))}
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
