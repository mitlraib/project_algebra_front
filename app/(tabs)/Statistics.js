import React from 'react';
import { Text, View, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import styles from '../../styles/styles';
import { courses } from '../../constants/CoursesNames';

export default function Statistics() {
    const router = useRouter();

    function handleGoBack() {
        router.push('/Dashboard');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>סטטיסטיקה</Text>
            {/* כפתור חזרה בצד שמאל */}
            <Pressable onPress={handleGoBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>🔙 חזרה למסך הראשי</Text>
            </Pressable>
        </View>
    );
};