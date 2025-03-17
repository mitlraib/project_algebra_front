import React from 'react';
import { Text, View, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import styles from '../../styles/styles';
import { courses } from '../../constants/CoursesNames';

export default function MyCourses() {
    const router = useRouter();

    function handleGoBack() {
        router.push('/Dashboard');
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>הקורסים שלי</Text>
            <Pressable onPress={handleGoBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>🔙 חזרה למסך הראשי</Text>
            </Pressable>

            <FlatList
                data={courses}
                keyExtractor={(course) => course.id.toString()}
                renderItem={({ item: course }) => (
                    <View style={styles.courseContainer}>
                        <Text style={styles.courseTitle}>{course.title}</Text>

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
                                    <Card style={localStyles.card}>
                                        <Card.Content>
                                            <Text style={localStyles.cardTitle}>{topic.name}</Text>
                                        </Card.Content>
                                    </Card>
                                </Pressable>
                            )}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const localStyles = StyleSheet.create({
    card: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    cardTitle: {
        fontSize: 20,
        textAlign: 'center'
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 10,
        textAlign: 'left',
        alignSelf: 'flex-end',
    },
    backButtonText: {
        fontSize: 16,
        color: 'blue',


    },
});
