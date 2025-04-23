import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { courses } from '../../constants/CoursesNames';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const width = Dimensions.get('window').width;

const Colors = {
    primary: '#8b5cf6',
    accent: '#fb923c',
    background: '#f8f6ff',
    light: '#ede9fe',
    text: '#111827',
    cardBg: '#ffffff',
    shadow: '#000',
};

const topicIcons = {
    "חיבור": "plus-circle",
    "חיסור": "minus-circle",
    "כפל": "x-circle",
    "חילוק": "divide-circle",
    "חיבור שברים": "plus-square",
    "חיסור שברים": "minus-square",
    "כפל שברים": "x-square",
    "חילוק שברים": "divide-square",
};

export default function MyCourses() {
    const router = useRouter();

    function handleGoBack() {
        router.push('/Dashboard');
    }

    return (
        <ProtectedRoute requireAuth={true}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>הקורסים שלי</Text>

                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>🔙 חזרה למסך הראשי</Text>
                </Pressable>

                {courses.map((course) => (
                    <View key={course.id} style={styles.courseBox}>
                        <LinearGradient
                            colors={[Colors.primary, Colors.accent]}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.courseHeader}
                        >
                            <Text style={styles.courseTitle}>{course.title}</Text>
                        </LinearGradient>

                        <View style={styles.topicGrid}>
                            {course.topics.map((topic, i) => (
                                <Pressable
                                    key={topic.id}
                                    onPress={() => router.push(`/course/${topic.id}`)}
                                    style={[styles.topicCardWrapper, { marginTop: i % 2 === 0 ? 0 : 12 }]}
                                >
                                    <LinearGradient
                                        colors={['#ede9fe', '#c4b5fd']}
                                        style={styles.topicCard}
                                    >
                                        <Feather
                                            name={topicIcons[topic.name] || "book"}
                                            size={30}
                                            color={Colors.primary}
                                        />                                        <Text style={styles.topicText}>{topic.name}</Text>
                                    </LinearGradient>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: Colors.background,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 16,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    backButtonText: {
        fontSize: 16,
        color: Colors.accent,
        fontWeight: '600',
    },
    courseBox: {
        width: width * 0.9,
        marginBottom: 32,
        backgroundColor: Colors.cardBg,
        borderRadius: 20,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        overflow: 'hidden',
    },
    courseHeader: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.primary,
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    topicGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 16,
    },
    topicCardWrapper: {
        width: 100,
        marginBottom: 20,
    },
    topicCard: {
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    topicText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
        textAlign: 'center',
        marginTop: 6,
    },
});