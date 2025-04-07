//MyCourses

import React from 'react';
import { Text, View, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import styles from '../../styles/styles';
import { courses } from '../../constants/CoursesNames';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function MyCourses() {
    const router = useRouter();

    function handleGoBack() {
        router.push('/Dashboard');
    }

    return (
        <ProtectedRoute requireAuth={true}>

        <View style={styles.container}>
            <Text style={styles.title}>הקורסים שלי</Text>

            {/* כפתור חזרה בצד שמאל */}
            <Pressable onPress={handleGoBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>🔙 חזרה למסך הראשי</Text>
            </Pressable>

            <FlatList
                data={courses}
                keyExtractor={(course) => course.id.toString()}
                renderItem={({ item: course }) => (
                    <View style={styles.container}>
                        <Text style={styles.title}>{course.title}</Text>

                        {/* הצגת הנושאים ככרטיסים */}
                        <FlatList
                            data={course.topics}
                            keyExtractor={(topic) => topic.id.toString()}
                            numColumns={4}
                            columnWrapperStyle={styles.row}
                            renderItem={({ item: topic }) => (
                                <Pressable
                                    onPress={() => router.push(`/course/${topic.id}`)}
                                    style={{ margin: 5 }}
                                >
                                    <Card style={styles.card}>
                                        <Card.Content>
                                            <Text style={styles.cardTitle}>{topic.name}</Text>
                                        </Card.Content>
                                    </Card>
                                </Pressable>
                            )}
                        />
                    </View>
                )}
            />
        </View>
        </ProtectedRoute>

    );
};


// end of MyCourses