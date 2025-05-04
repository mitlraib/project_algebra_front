//(tabs)/MyCourses
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProtectedRoute from '../../components/ProtectedRoute';
import { courses } from '../../constants/CoursesNames';
import {myCoursesStyles} from '../../styles/styles'
import { HomeButton } from '../../src/utils/Utils';
import { Colors } from '../../constants/Colors';

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

     function TopicButton({ iconName, label, onPress }) {
        return (
            <Pressable onPress={onPress} style={myCoursesStyles.wrapper}>
                <LinearGradient
                    colors={[Colors.light, Colors.lightPurple]}
                    style={myCoursesStyles.circle}
                >
                    <Feather name={iconName} size={30} color={Colors.primary} />
                    <Text style={myCoursesStyles.label}>{label}</Text>
                </LinearGradient>
            </Pressable>
        );
    }








    return (
        <ProtectedRoute requireAuth={true}>

            <HomeButton />

            <ScrollView contentContainerStyle={myCoursesStyles.container}>
                <Text style={myCoursesStyles.title}>הקורסים שלי</Text>

                <View style={myCoursesStyles.topicGrid}>
                    {courses.map((course) => (
                        <View key={course.id} style={myCoursesStyles.courseBox}>
                            <LinearGradient
                                colors={[Colors.primary, Colors.accent]}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 0 }}
                                style={myCoursesStyles.courseHeader}
                            >
                                <Text style={myCoursesStyles.courseTitle}>{course.title}</Text>
                            </LinearGradient>

                            <View style={myCoursesStyles.topicGrid}>
                                {course.topics.map((topic) => (
                                    <TopicButton
                                        key={topic.id}
                                        iconName={topicIcons[topic.name] || "book"}
                                        label={topic.name}
                                        onPress={() => router.push(`/course/${topic.id}`)}
                                    />
                                ))}
                            </View>
                        </View>
                    ))}

                </View>
            </ScrollView>
        </ProtectedRoute>
    );
}

