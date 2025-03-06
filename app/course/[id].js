import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View, Pressable } from 'react-native';
import { courses } from '../../constants/CoursesNames';
import styles from '../../styles/styles';

export default function CoursePage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const topic = courses.flatMap(course => course.topics).find(topic => topic.id.toString() === id);

    if (!topic) {
        return <Text style={styles.notFound}>הנושא לא נמצא</Text>;
    }

    // אם הנושא הוא "חיבור", מעבירים לדף החיבור
    if (topic.name === 'חיבור') {
        router.replace(`/course/AdditionPage`);
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{topic.name}</Text>
            <Text style={styles.content}>
                כאן יוצג תוכן של הנושא "{topic.name}" (עדיין לא ממומש תרגיל).
            </Text>
        </View>
    );
}
