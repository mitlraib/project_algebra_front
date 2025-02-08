import React from 'react';
import { Text, View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../styles/styles';
import { courses } from '../../constants/CoursesNames';

const MyCourses = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MyCourses</Text>

            <FlatList
                data={courses}
                keyExtractor={course => course.id.toString()}
                renderItem={({ item: course }) => (
                    <View style={styles.courseContainer}>
                        <Text style={styles.courseTitle}>{course.title}</Text>

                        <FlatList
                            data={course.topics}
                            keyExtractor={topic => topic.id.toString()}
                            renderItem={({ item: topic }) => (
                                <Pressable
                                    style={styles.topicButton}
                                    onPress={() => router.push(`/course/${topic.id}`)}
                                >
                                    <Text style={styles.topicText}>{topic.name}</Text>
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

