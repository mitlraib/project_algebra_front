import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { HomeButton } from '../utils/Utils';

const BADGES = {
    addition_master: {
        name: "מאסטר חיבור",
        color: "#8b5cf6",
        icon: "plus",
    },
    subtraction_pro: {
        name: "פרו חיסור",
        color: "#fb923c",
        icon: "minus",
    },
    multiplication_wizard: {
        name: "קוסם כפל",
        color: "#8b5cf6",
        icon: "times",
    },
    division_expert: {
        name: "מומחה חילוק",
        color: "#fb923c",
        icon: "percent",
    },
    complex_fractions: {
        name: "שברים מורכבים",
        color: "#8b5cf6",
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
                const res = await axios.get(`http://localhost:8080/api/achievements/${userId}`);
                const data = res.data;

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
                    Math.floor(
                        (data.fractionAddition +
                            data.fractionSubtraction +
                            data.fractionMultiplication +
                            data.fractionDivision) /
                        20
                    )
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
                <HomeButton />

                <View style={styles.container}>
                    <LinearGradient
                        colors={["#8b5cf6", "#fb923c"]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.titleBox}
                    >
                        <Text style={styles.title}>🎖️ ההישגים שלך</Text>
                    </LinearGradient>
                    <View style={styles.starsRow}>
                        <FontAwesome name="star" size={20} color="#FACC15" />
                        <Text style={styles.starsText}>{stars.totalStars} כוכבים</Text>
                        <FontAwesome name="trophy" size={20} color="#FB923C" style={{ marginLeft: 20 }} />
                        <Text style={styles.starsText}>{stars.totalCandles} גביעים</Text>
                    </View>

                    {Object.entries(BADGES).map(([key, badge], index) => {
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
                        const progress = Math.min((count / nextThreshold) * 100, 100);

                        return (
                            <LinearGradient
                                key={key}
                                colors={["#ede9fe", "#c4b5fd"]}
                                style={styles.badgeCard}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 0 }}
                            >
                                <View style={styles.badgeHeader}>
                                    <View style={[styles.badgeIconCircle, { backgroundColor: badge.color }]}>
                                        <FontAwesome name={badge.icon} size={20} color="white" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.badgeTitle}>{badge.name}</Text>
                                        <Text style={styles.badgeDesc}>
                                            את בדרך הנכונה! רק עוד {20 - (count % 20 || 20)} תרגילים לכוכב הבא 🌟
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.progressRow}>
                                    <View style={styles.progressBar}>
                                        <LinearGradient
                                            colors={["#8b5cf6", "#fb923c"]}
                                            start={{ x: 1, y: 0 }}
                                            end={{ x: 0, y: 0 }}
                                            style={[styles.progressFill, { width: `${progress}%` }]}
                                        />
                                    </View>
                                    <Text style={styles.progressText}>{count}/{nextThreshold}</Text>
                                </View>
                            </LinearGradient>
                        );
                    })}

                    {stars.totalCandles > 0 && (
                        <LinearGradient
                            colors={["#ede9fe", "#c4b5fd"]}
                            style={styles.mathChampionBox}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                        >
                            <Text style={styles.mathChampionText}>
                                🤯 וואו! את אלופת המתמטיקה עם {stars.totalCandles} גביע/ים 🎉{"\n"}
                                קיבלת גביע על כל סיבוב שבו הצלחת להשיג כוכב בכל נושא – כולל השברים הסוררים! 🏅
                            </Text>
                        </LinearGradient>
                    )}
                </View>
            </ScrollView>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    scroll: {
        paddingVertical: 32,
        alignItems: "center",
    },
    container: {
        width: "90%",
        maxWidth: 700,
    },
    backButton: {
        alignSelf: "flex-start",
        marginBottom: 8,
        marginLeft: 10,
    },
    backButtonText: {
        color: "#8b5cf6",
        fontWeight: "600",
        fontSize: 18,
    },
    titleBox: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    },
    starsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
    },
    starsText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#444",
    },
    badgeCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
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
        color: "#111827",
    },
    badgeDesc: {
        color: "#555",
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
        height: 8,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#E5E7EB",
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
    mathChampionBox: {
        marginTop: 20,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    mathChampionText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
        color: "#4B0082",
        lineHeight: 26,
    },
});
