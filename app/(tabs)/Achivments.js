import React, { useEffect, useState, useRef } from "react";
import {View, Text, ScrollView, StyleSheet, Dimensions, Pressable, Alert} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";
import axios from "axios";


const BADGES = {
    addition_master: {
        name: "מאסטר חיבור",
        description: "פתרו עוד 20 תרגילי חיבור כדי להשיג כוכב",
        color: "#3B82F6",
        icon: "plus",
    },
    subtraction_pro: {
        name: "פרו חיסור",
        description: "פתרו עוד 20 תרגילי חיסור כדי להשיג כוכב",
        color: "#EF4444",
        icon: "minus",
    },
    multiplication_wizard: {
        name: "קוסם כפל",
        description: "פתרו 20 עוד תרגילי כפל כדי להשיג כוכב",
        color: "#10B981",
        icon: "times",
    },
    division_expert: {
        name: "מומחה חילוק",
        description: "פתרו עוד  תרגילי חילוק כדי להשיג כוכב",
        color: "#8B5CF6",
        icon: "divide",
    },
    math_champion: {
        name: "אלוף המתמטיקה",
        description: "השיגו את כל התגים",
        color: "#FBBF24",
        icon: "trophy",
    },
};

export default function AchievementsPage() {
    const [badges, setBadges] = useState([]);
    const [stars, setStars] = useState({
        totalStars: 0,
        totalCandles: 0,
        totalCrowns: 0,
    });
    const [stats, setStats] = useState({
        addition: 0,
        subtraction: 0,
        multiplication: 0,
        division: 0,
    });
    const [userId, setUserId] = useState(null);

    // משתנה עזר לזכור ערכים קודמים של כוכבים/גביעים/כתרים
    const prevStarsRef = useRef({
        totalStars: 0,
        totalCandles: 0,
        totalCrowns: 0,
    });



    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get("/api/user");
                if (res.data.success) {
                    setUserId(res.data.userId);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (!userId) return;

        async function fetchAchievements() {
            try {
                const res = await axios.get(`http://localhost:8080/api/achievements/${userId}`);
                const data = res.data;

                setStats(data);

                const earned = [];
                if (data.addition >= 20) earned.push("addition_master");
                if (data.subtraction >= 20) earned.push("subtraction_pro");
                if (data.multiplication >= 20) earned.push("multiplication_wizard");
                if (data.division >= 20) earned.push("division_expert");
                if (earned.length === 4) earned.push("math_champion");
                setBadges(earned);

                const totalStars = Math.floor(data.addition / 20) + Math.floor(data.subtraction / 20) + Math.floor(data.multiplication / 20) + Math.floor(data.division / 20);
                const totalCandles = Math.floor(totalStars / 100);
                const totalCrowns = Math.floor(totalStars / 500);



                // עדכון סטייט ועדכון רפרנס
                setStars({
                    totalStars,
                    totalCandles,
                    totalCrowns,
                });

                prevStarsRef.current = {
                    totalStars,
                    totalCandles,
                    totalCrowns,
                };
            } catch (err) {
                console.error("Failed to fetch achievements:", err);
            }
        }

        fetchAchievements();
    }, [userId]);

    const handleGoBack = () => {
        router.push("/Dashboard");
    };

    return (
        <ProtectedRoute requireAuth={true}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>🔙 חזרה למסך הראשי</Text>
                </Pressable>
                <View style={styles.container}>
                    <View style={styles.header}>

                        <View style={styles.awardCircle}>
                            <FontAwesome name="trophy" size={32} color="#FBBF24" />
                        </View>
                        <Text style={styles.title}>ההישגים שלך</Text>

                        <View style={[styles.starsRow, { gap: 16 }]}>
                            <View style={styles.rewardItem}>
                                <FontAwesome name="star" size={18} color="#FACC15" />
                                <Text style={styles.starsText}>{stars.totalStars} כוכבים</Text>
                            </View>
                            <View style={styles.rewardItem}>
                                <FontAwesome name="trophy" size={18} color="#FB923C" />
                                <Text style={styles.starsText}>{stars.totalCandles} גביעים</Text>
                            </View>
                            <View style={styles.rewardItem}>
                                <FontAwesome name="crown" size={18} color="#FBBF24" />
                                <Text style={styles.starsText}>{stars.totalCrowns} כתרים</Text>
                            </View>
                        </View>
                    </View>

                    {Object.entries(BADGES).map(([key, badge]) => {
                        const isUnlocked = badges.includes(key);
                        const count =
                            key === "addition_master"
                                ? stats.addition
                                : key === "subtraction_pro"
                                    ? stats.subtraction
                                    : key === "multiplication_wizard"
                                        ? stats.multiplication
                                        : key === "division_expert"
                                            ? stats.division
                                            : badges.length === 5
                                                ? 20
                                                : 0;


                        // מחשבים את הסף הבא כעלייה של 20 שאלות
                        const nextThreshold = Math.floor(count / 20) * 20 + 20;
                        const maxCount = nextThreshold;  // הסף הבא הוא המקסימום
                        const progress = Math.min((count / maxCount) * 100, 100);  // חישוב ההתקדמות

                        const stars = Math.floor(count / 20);  // כל 20 שאלות שוות כוכב אחד

                        return (
                            <View
                                key={key}
                                style={[
                                    styles.badgeCard,
                                    { borderColor: isUnlocked ? "#10B981" : "#E5E7EB" },
                                ]}
                            >
                                <View style={styles.badgeHeader}>
                                    <View
                                        style={[
                                            styles.badgeIconCircle,
                                            { backgroundColor: badge.color },
                                        ]}
                                    >
                                        <FontAwesome name={badge.icon} size={20} color="white" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.badgeTitle}>
                                            {badge.name}{" "}
                                            {!isUnlocked && (
                                                <FontAwesome name="lock" size={14} color="#9CA3AF" />
                                            )}
                                        </Text>
                                        <Text style={styles.badgeDesc}>{badge.description}</Text>
                                    </View>
                                </View>
                                <View style={styles.progressRow}>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    backgroundColor: badge.color,
                                                    width: `${progress}%`,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.progressText}>{count}/{maxCount}</Text>                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </ProtectedRoute>
    );
}

const { width } = Dimensions.get("window");


const styles = StyleSheet.create({
    scroll: {
        paddingVertical: 32,
        alignItems: "center",
    },
    container: {
        width: "90%",
        maxWidth: 700,
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
    },
    backButton: {
        alignSelf: "flex-start",
        marginBottom: 8,
        marginLeft:10
    },
    backButtonText: {
        color: "#3B82F6",
        fontWeight: "600",
        fontSize: 20,
    },
    awardCircle: {
        backgroundColor: "#FEF3C7",
        padding: 16,
        borderRadius: 50,
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    starsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    rewardItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    starsText: {
        fontWeight: "600",
        fontSize: 16,
        color: "#444",
    },
    badgeCard: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        backgroundColor: "white",
    },
    badgeHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    badgeIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeTitle: {
        fontWeight: "bold",
        fontSize: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    badgeDesc: {
        color: "gray",
        fontSize: 13,
        marginTop: 2,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    progressBar: {
        flex: 1,
        backgroundColor: "#E5E7EB",
        height: 8,
        borderRadius: 8,
        overflow: "hidden",
    },
    progressFill: {
        height: 8,
        borderRadius: 8,
    },
    progressText: {
        fontSize: 11,
        color: "#444",
        width: 40,
        textAlign: "right",
    },
});