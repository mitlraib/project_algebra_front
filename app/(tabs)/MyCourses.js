import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { courses } from '../../constants/CoursesNames';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {myCoursesStyles} from '../../styles/styles'
import { HomeButton } from './Utils';


const width = Dimensions.get('window').width;

const Colors = {
    primary: '#8b5cf6',
    accent: '#fb923c',
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

            <HomeButton />

            <ScrollView contentContainerStyle={myCoursesStyles.container}>
                <Text style={myCoursesStyles.title}>הקורסים שלי</Text>



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
                            {course.topics.map((topic, i) => (
                                <Pressable
                                    key={topic.id}
                                    onPress={() => router.push(`/course/${topic.id}`)}
                                    style={[myCoursesStyles.topicCardWrapper, { marginTop: i % 2 === 0 ? 0 : 12 }]}
                                >
                                    <LinearGradient
                                        colors={['#ede9fe', '#c4b5fd']}
                                        style={myCoursesStyles.topicCard}
                                    >
                                        <Feather
                                            name={topicIcons[topic.name] || "book"}
                                            size={30}
                                            color={Colors.primary}
                                        />                                        <Text style={myCoursesStyles.topicText}>{topic.name}</Text>
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

