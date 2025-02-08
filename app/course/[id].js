import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { courses } from '../../constants/CoursesNames';
import styles from '../../styles/styles';

const CoursePage = () => {
    const { id } = useLocalSearchParams(); // מקבל את הפרמטר מהכתובת URL
    const topic = courses.flatMap(course => course.topics).find(topic => topic.id.toString() === id);

    if (!topic) return <Text style={styles.notFound}>הנושא לא נמצא</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{topic.name}</Text>
            <Text style={styles.content}>כאן יוצג תוכן של הנושא {topic.name}</Text>
        </View>
    );
};

export default CoursePage;
