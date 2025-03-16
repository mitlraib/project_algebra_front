import React from 'react';
import { Text, View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import styles from '../../styles/styles';
import { courses } from '../../constants/CoursesNames';

const MyCourses = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MyCourses</Text>

            <FlatList
                data={courses}
                keyExtractor={(course) => course.id.toString()}
                renderItem={({ item: course }) => (
                    <View style={styles.courseContainer}>
                        <Text style={styles.courseTitle}>{course.title}</Text>

                        {/* הצגת הנושאים ככרטיסים   */}
                        <FlatList
                            data={course.topics}
                            keyExtractor={(topic) => topic.id.toString()}
                            numColumns={4} // 4 כרטיסים בכל שורה
                            columnWrapperStyle={styles.row} // סידור יפה של הכרטיסים
                            renderItem={({ item: topic }) => (
                                <Pressable onPress={() => router.push(`/course/${topic.id}`)}>
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
    );
};

export default MyCourses;
