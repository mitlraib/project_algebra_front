import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

export default function AchievementsScreen() {
    const [userProgress, setUserProgress] = useState({});
    const [userId, setUserId] = useState(null);

    const allSubjects = ['חיבור', 'חיסור', 'כפל', 'חילוק', 'שברים'];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/user');
                if (res.data.success) setUserId(res.data.userId);
            } catch (err) {
                console.error("USER FETCH ERROR", err);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!userId) return;
        const fetchAchievements = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/achievements/${userId}`);
                const data = res.data;

                const formatted = {
                    חיבור: data.addition,
                    חיסור: data.subtraction,
                    כפל: data.multiplication,
                    חילוק: data.division,
                    שברים:
                        data.fractionAddition +
                        data.fractionSubtraction +
                        data.fractionMultiplication +
                        data.fractionDivision,
                    התמדה: data.weeklyStreak || 0
                };

                setUserProgress(formatted);
            } catch (err) {
                console.error("ACHIEVEMENT FETCH ERROR", err);
            }
        };

        fetchAchievements();
    }, [userId]);

    const trainedAllWeek = userProgress["התמדה"] >= 1;

    const hasAllChampionMedals = allSubjects.every(subject => (userProgress[subject] || 0) >= 40);
    const completedBaseSubjects = allSubjects.filter(subject => (userProgress[subject] || 0) >= 20);
    const baseMedalsProgress = (completedBaseSubjects.length / allSubjects.length) * 100;

    const allStages = [...generateStages(), ...specialMedals()];

    function generateStages() {
        const medals = [];
        const stages = ['מתקדם', 'אלוף'];
        const thresholds = [[0, 20], [20, 40]];

        allSubjects.forEach(subject => {
            thresholds.forEach(([min, max], i) => {
                medals.push({
                    subject,
                    stageTitle: `${stages[i]} ב${subject}`,
                    label: i === 0 ? "התחלה טובה! המשך כך 💪" : "כל הכבוד! 👏",
                    minProgress: min,
                    maxProgress: max,
                    color: '#FF914D',
                    gradientColor: '#A669FF',
                    icon: (
                        <View style={{ position: 'relative', width: 36, height: 36 }}>
                            <FontAwesome5 name="star" size={36} color="#6A0DAD" style={{ position: 'absolute', top: 0, left: 0 }} />
                            <FontAwesome5 name="star" size={32} color="#FFD700" style={{ position: 'absolute', top: 2, left: 2 }} />
                        </View>
                    )
                });
            });
        });

        return medals;
    }

    function specialMedals() {
        return [
            {
                subject: 'כללי',
                stageTitle: 'אלוף ההתמדה',
                label: 'תרגלי שבוע שלם כדי לזכות במדליית ההתמדה! 💪',
                minProgress: 0,
                maxProgress: 1,
                color: '#FF914D',
                gradientColor: '#A669FF',
                icon: (
                    <View style={{ position: 'relative', width: 36, height: 36 }}>
                        <FontAwesome5 name="medal" size={36} color="#6A0DAD" style={{ position: 'absolute', top: 0, left: 0 }} />
                        <FontAwesome5 name="medal" size={32} color="#FF6F61" style={{ position: 'absolute', top: 2, left: 2 }} />
                    </View>
                )
            },
            ...(hasAllChampionMedals ? [{
                subject: 'כללי',
                stageTitle: 'גאון המתמטיקה',
                label: 'השלמת את כל האליפויות! 👑',
                minProgress: 0,
                maxProgress: 1,
                color: '#FF914D',
                gradientColor: '#A669FF',
                icon: (
                    <View style={{ position: 'relative', width: 36, height: 36 }}>
                        <FontAwesome5 name="crown" size={36} color="#6A0DAD" style={{ position: 'absolute', top: 0, left: 0 }} />
                        <FontAwesome5 name="crown" size={32} color="#00B894" style={{ position: 'absolute', top: 2, left: 2 }} />
                    </View>
                )
            }] : [{
                subject: 'כללי',
                stageTitle: 'כוכב המתמטיקה',
                label: `הושגו ${completedBaseSubjects.length} מתוך ${allSubjects.length} בסיסים ✨`,
                minProgress: 0,
                maxProgress: 1,
                color: '#FF914D',
                gradientColor: '#A669FF',
                icon: (
                    <View style={{ position: 'relative', width: 36, height: 36 }}>
                        <FontAwesome5 name="star" size={36} color="#6A0DAD" style={{ position: 'absolute', top: 0, left: 0 }} />
                        <FontAwesome5 name="star" size={32} color="#FFC300" style={{ position: 'absolute', top: 2, left: 2 }} />
                    </View>
                ),
                percentOverride: baseMedalsProgress
            }])
        ];
    }

    const activeAchievements = allStages.filter(stage => {
        const progress = userProgress[stage.subject] || 0;
        return progress >= stage.minProgress && progress < stage.maxProgress;
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>הישגים 🏆</Text>
            <Text style={styles.subText}>כל הכבוד על ההתקדמות! המשיכו להרוויח תגים ומדליות 🤩</Text>

            <View style={styles.grid}>
                {activeAchievements.map((item, index) => {
                    const progress = userProgress[item.subject] || 0;
                    const percent =
                        item.percentOverride !== undefined
                            ? item.percentOverride
                            : ((progress - item.minProgress) / (item.maxProgress - item.minProgress)) * 100;

                    const remaining = Math.max(item.maxProgress - progress, 0);

                    return (
                        <View key={index} style={{ width: 440, marginBottom: 16 }}>

                            <LinearGradient
                                colors={[item.color, item.gradientColor || '#DAF3FB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.card, { borderColor: '#6C63FF', borderWidth: 2.5 }]}
                            >
                                <View style={{ marginBottom: 8 }}>{item.icon}</View>
                                <Text style={styles.cardTitle}>{item.stageTitle}</Text>

                                {progress === 0 ? (
                                    <Text style={styles.remainingText}>
                                        יש לתרגל {item.subject} כדי לזכות במדליה 🥇
                                    </Text>
                                ) : (

                                    <Text style={styles.remainingText}>
                                        עוד {remaining} תרגיל{remaining !== 1 ? "ים" : ""} כדי להגיע ליעד הבא!
                                    </Text>
                                )}


                                <Text style={styles.cardLabel}>{item.label}</Text>

                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
                                </View>
                            </LinearGradient>

                        </View>
                    );
                })}
            </View>

            <Text style={styles.footer}>רוצים עוד הישגים? המשיכו לתרגל 🚀</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: '#F3F5FE',
        alignItems: 'center',
    },
    header: {
        fontSize: 42,
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#FF914D',
    },
    subText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: 30,
    },
    card: {
        width: 440,
        height: 180,
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardLabel: {
        fontSize: 13,
        color: '#555',
        marginTop: 4,
        textAlign: 'center',
    },
    progressBarBackground: {
        width: '100%',
        height: 8,
        backgroundColor: '#DDD',
        borderRadius: 10,
        marginTop: 20,
    },
    progressBarFill: {
        height: 8,
        backgroundColor: '#6C63FF',
        borderRadius: 10,
    },
    remainingText: {
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 2,
    },

    footer: {
        marginTop: 24,
        fontSize: 16,
        textAlign: 'center',
        color: '#444',
    },
});
