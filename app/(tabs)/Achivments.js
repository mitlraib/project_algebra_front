import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";
import axios from "axios";

const BADGES = {
    addition_master: {
        name: "מאסטר חיבור",
        color: "#3B82F6",
        icon: "plus",
    },
    subtraction_pro: {
        name: "פרו חיסור",
        color: "#EF4444",
        icon: "minus",
    },
    multiplication_wizard: {
        name: "קוסם כפל",
        color: "#10B981",
        icon: "times",
    },
    division_expert: {
        name: "מומחה חילוק",
        color: "#8B5CF6",
        icon: "percent",
    },
    complex_fractions: {
        name: "שברים מורכבים",
        color: "#F59E0B",
        icon: "puzzle-piece",
    }
};

export default function AchievementsPage() {
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
        fractionAddition: 0,
        fractionSubtraction: 0,
        fractionMultiplication: 0,
        fractionDivision: 0,
    });
    const [userId, setUserId] = useState(null);

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
                const res = await axios.get(`http://localhost:8080/api/achievements/${userId}`);                const data = res.data;

                setStats(data);


                const totalStars =
                    Math.floor(data.addition / 20) +
                    Math.floor(data.subtraction / 20) +
                    Math.floor(data.multiplication / 20) +
                    Math.floor(data.division / 20) +
                    Math.floor(data.fractionAddition / 20) +
                    Math.floor(data.fractionSubtraction / 20) +
                    Math.floor(data.fractionMultiplication / 20) +
                    Math.floor(data.fractionDivision / 20);


                const minStarsPerTopic = Math.min(
                    Math.floor(data.addition / 20),
                    Math.floor(data.subtraction / 20),
                    Math.floor(data.multiplication / 20),
                    Math.floor(data.division / 20),
                    Math.floor((
                        data.fractionAddition +
                        data.fractionSubtraction +
                        data.fractionMultiplication +
                        data.fractionDivision
                    ) / 20)
                );

                const totalCandles = minStarsPerTopic;

                setStars({
                    totalStars,
                    totalCandles,
                });

                prevStarsRef.current = {
                    totalStars,
                    totalCandles,
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

                        <View style={[styles.starsRow, { gap: 24 }]}>
                            <View style={styles.rewardItem}>
                                <FontAwesome name="star" size={30} color="#FACC15" />
                                <Text style={styles.starsTextBig}>{stars.totalStars} כוכבים</Text>
                            </View>
                            <View style={styles.rewardItem}>
                                <FontAwesome name="trophy" size={30} color="#FB923C" />
                                <Text style={styles.starsTextBig}>{stars.totalCandles} גביעים</Text>
                            </View>
                        </View>

                    </View>

                    {Object.entries(BADGES).map(([key, badge]) => {
                        const safeMin = (...values) =>
                            values.every(v => typeof v === "number" && !isNaN(v)) ? Math.min(...values) : 0;

                        const count =
                            key === "complex_fractions"
                                ? stats.fractionAddition +
                                stats.fractionSubtraction +
                                stats.fractionMultiplication +
                                stats.fractionDivision
                                : key === "addition_master"
                                    ? stats.addition
                                    : key === "subtraction_pro"
                                        ? stats.subtraction
                                        : key === "multiplication_wizard"
                                            ? stats.multiplication
                                            : key === "division_expert"
                                                ? stats.division
                                                : 0;

                        const nextThreshold = Math.floor(count / 20) * 20 + 20;
                        const maxCount = nextThreshold;
                        const progress = Math.min((count / maxCount) * 100, 100);

                        return (
                            <View key={key} style={[styles.badgeCard, { borderColor: badge.color }]}>                                <View style={styles.badgeHeader}>
                                    <View style={[styles.badgeIconCircle, { backgroundColor: badge.color }]}>
                                        <FontAwesome name={badge.icon} size={20} color="white" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.badgeTitle}>{badge.name}</Text>
                                        <Text style={styles.badgeDesc}>
                                            את בדרך הנכונה! רק עוד {20 - (count % 20 || 20)} תרגילים לכוכב הבא 🌟 </Text>
                                    </View>
                                </View>
                                <View style={styles.progressRow}>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    backgroundColor: badge.color,
                                                    width: `${progress}%`                                            },
                                                ]}
                                        />
                                    </View>
                                    <Text style={styles.progressText}>
                                        {count}/{maxCount}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                    {stars.totalCandles > 0 && (
                        <View style={styles.mathChampionBox}>
                            <Text style={styles.mathChampionText}>
                                🤯 וואו! את אלופת המתמטיקה עם {stars.totalCandles} גביע/ים{stars.totalCandles > 1 ? "ים" : ""} 🎉{"\n"}
                                קיבלת גביע על כל סיבוב שבו הצלחת להשיג כוכב בכל נושא – כולל השברים הסוררים!{"\n"}
                                ממש אולימפיאדת חשבון פה! 🏅
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </ProtectedRoute>
    );
}

const {  width } = Dimensions.get("window");

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
        marginLeft: 10,
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
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4, // לאנדרואיד
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
    starsTextBig: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#111827",
        marginLeft: 8,
    },
    centeredText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        color: "#3B82F6",
        marginVertical: 16,
        lineHeight: 26,
    },
    mathChampionBox: {
        marginTop: 0,
        backgroundColor: "#FEF3C7", // רקע זהוב בהיר
        padding: 16,
        borderRadius: 16,
        marginVertical: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4, // לאנדרואיד
    },

    mathChampionText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#B45309", // חום-זהוב כהה
        lineHeight: 28,
    }
});