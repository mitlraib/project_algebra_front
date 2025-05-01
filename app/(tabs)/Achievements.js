import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ProtectedRoute from "../../components/ProtectedRoute";
import { LinearGradient } from "expo-linear-gradient";
import { HomeButton } from '../../src/utils/Utils';
import {achievementsStyles} from '../../styles/styles';
import {Colors} from '../../constants/Colors';
import { api } from  '../../components/api';


const BADGES = {
    addition_master: {
        name: "מאסטר חיבור",
        color: Colors.primary,
        icon: "plus",
    },
    subtraction_pro: {
        name: "פרו חיסור",
        color: Colors.accent,
        icon: "minus",
    },
    multiplication_wizard: {
        name: "קוסם כפל",
        color: Colors.primary,
        icon: "times",
    },
    division_expert: {
        name: "מומחה חילוק",
        color: Colors.accent,
        icon: "percent",
    },
    complex_fractions: {
        name: "שברים מורכבים",
        color: Colors.primary,
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
                const res = await api.get("/api/user");
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
                const res = await api.get(`/api/achievements/${userId}`);
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



    return (
        <ProtectedRoute requireAuth={true}>
            <ScrollView contentContainerStyle={achievementsStyles.scroll}>
                <HomeButton />

                <View style={achievementsStyles.container}>
                    <LinearGradient
                        colors={[Colors.primary, Colors.accent]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={achievementsStyles.titleBox}
                    >
                        <Text style={achievementsStyles.title}>🎖️ ההישגים שלך</Text>
                    </LinearGradient>
                    <View style={achievementsStyles.starsRow}>
                        <FontAwesome name="star" size={20} color={Colors.darkYellow} />
                        <Text style={achievementsStyles.starsText}>{stars.totalStars} כוכבים</Text>
                        <FontAwesome name="trophy" size={20} color={Colors.freckleOrange} style={{ marginLeft: 20 }} />
                        <Text style={achievementsStyles.starsText}>{stars.totalCandles} גביעים</Text>
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
                                colors={[Colors.light, Colors.lightPurple]}
                                style={achievementsStyles.badgeCard}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 0 }}
                            >
                                <View style={achievementsStyles.badgeHeader}>
                                    <View style={[achievementsStyles.badgeIconCircle, { backgroundColor: badge.color }]}>
                                        <FontAwesome name={badge.icon} size={20} color="white" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={achievementsStyles.badgeTitle}>{badge.name}</Text>
                                        <Text style={achievementsStyles.badgeDesc}>
                                            את בדרך הנכונה! רק עוד {count % 20 === 0 ? 20 : 20 - (count % 20)} תרגילים לכוכב הבא 🌟
                                        </Text>

                                    </View>
                                </View>
                                <View style={achievementsStyles.progressRow}>
                                    <View style={achievementsStyles.progressBar}>
                                        <LinearGradient
                                            colors={[Colors.primary, Colors.accent]}
                                            start={{ x: 1, y: 0 }}
                                            end={{ x: 0, y: 0 }}
                                            style={[achievementsStyles.progressFill, { width: `${progress}%` }]}
                                        />
                                    </View>
                                    <Text style={achievementsStyles.progressText}>{count}/{nextThreshold}</Text>
                                </View>
                            </LinearGradient>
                        );
                    })}

                    <LinearGradient
                        colors={[Colors.light, Colors.lightPurple]}
                        style={achievementsStyles.mathChampionBox}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                    >
                        {stars.totalCandles === 0 ? (
                            <Text style={achievementsStyles.mathChampionText}>
                                עדיין לא צברת גביעים. השג כוכב בכל אחד מהנושאים כדי לזכות בגביע הראשון שלך!
                            </Text>
                        ) : (
                            <Text style={achievementsStyles.mathChampionText}>
                                🤯 וואו! את אלופת המתמטיקה עם {stars.totalCandles} גביע/ים 🎉{"\n"}
                                קיבלת גביע על כל סיבוב שבו הצלחת להשיג כוכב בכל נושא – כולל השברים הסוררים! 🏅
                            </Text>
                        )}
                    </LinearGradient>

                </View>
            </ScrollView>
        </ProtectedRoute>
    );
}

