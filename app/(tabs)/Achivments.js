//AchievementsPage

import React, { useEffect, useState } from "react";
import {View, Text, ScrollView, StyleSheet, Dimensions, Pressable} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {router} from "expo-router";

const BADGES = {
    addition_master: {
        name: "מאסטר חיבור",
        description: "פתרו 20 תרגילי חיבור",
        color: "#3B82F6", // כחול
        icon: "plus",
    },
    subtraction_pro: {
        name: "פרו חיסור",
        description: "פתרו 20 תרגילי חיסור",
        color: "#EF4444", // אדום
        icon: "minus",
    },
    multiplication_wizard: {
        name: "קוסם כפל",
        description: "פתרו 20 תרגילי כפל",
        color: "#10B981", // ירוק
        icon: "times",
    },
    division_expert: {
        name: "מומחה חילוק",
        description: "פתרו 20 תרגילי חילוק",
        color: "#8B5CF6", // סגול
        icon: "divide",
    },
    math_champion: {
        name: "אלוף המתמטיקה",
        description: "השיגו את כל התגים",
        color: "#FBBF24", // צהוב
        icon: "trophy",
    },
};

export default function AchievementsPage() {
    const [badges, setBadges] = useState([]);
    const [stars, setStars] = useState(0);
    const [stats, setStats] = useState({
        addition: 0,
        subtraction: 0,
        multiplication: 0,
        division: 0,
    });

    useEffect(() => {
        // נתוני דמו (תשלבי ב-axios/שרת שלך בהמשך)
        setBadges(["addition_master", "multiplication_wizard"]);
        setStars(12);
        setStats({
            addition: 17,
            subtraction: 12,
            multiplication: 20,
            division: 5,
        });
    }, []);
    function handleGoBack() {
        router.push("/Dashboard");
    }

    return (
        <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={handleGoBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>⬅ חזרה לדאשבורד</Text>
                    </Pressable>
                    <View style={styles.awardCircle}>
                        <FontAwesome name="trophy" size={32} color="#FBBF24" />
                    </View>
                    <Text style={styles.title}>ההישגים שלך</Text>
                    <View style={styles.starsRow}>
                        <FontAwesome name="star" size={18} color="#FACC15" />
                        <Text style={styles.starsText}>{stars} כוכבים</Text>
                    </View>
                </View>

                {/* כרטיסים */}
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
                                        : badges.length === 4
                                            ? 20
                                            : 0;

                    const progress = Math.min((count / 20) * 100, 100);

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
                                    <FontAwesome
                                        name={badge.icon}
                                        size={20}
                                        color="white"
                                    />
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
                                <Text style={styles.progressText}>{count}/20</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
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
        fontSize: 12,
        color: "#444",
        width: 40,
        textAlign: "right",
    },
});


//end of AchievementsPage
