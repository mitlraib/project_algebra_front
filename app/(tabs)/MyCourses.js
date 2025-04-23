import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { courses } from '../../constants/CoursesNames';

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
                        <Text style={styles.courseTitle}>{course.title}</Text>

                        <View style={styles.topicGrid}>
                            {course.topics.map((topic) => (
                                <Pressable
                                    key={topic.id}
                                    onPress={() => router.push(`/course/${topic.id}`)}
                                    style={styles.topicCardWrapper}
                                >
                                    <Card style={styles.topicCard}>
                                        <Card.Content>
                                            <Text style={styles.topicText}>{topic.name}</Text>
                                        </Card.Content>
                                    </Card>
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
        borderRadius: 16,
        padding: 16,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    courseTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    topicGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    topicCardWrapper: {
        width: '48%',
        marginBottom: 12,
    },
    topicCard: {
        backgroundColor: Colors.light,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    topicText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.primary,
        textAlign: 'center',
    },
});
