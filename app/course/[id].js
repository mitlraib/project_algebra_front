import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { courses } from '../../constants/CoursesNames';
import styles from '../../styles/styles';

export default function CoursePage() {
    const { id } = useLocalSearchParams();
    const topic = courses.flatMap(course => course.topics).find(topic => topic.id.toString() === id);

    const [selectedAnswer, setSelectedAnswer] = useState(null);  // אין :number | null
    const [showResult, setShowResult] = useState(false);

    // לדוגמה, מערך תשובות
    const answers = [5, 6, 4, 23];
    const correctAnswer = 5;

    if (!topic) {
        return <Text style={styles.notFound}>הנושא לא נמצא</Text>;
    }

    if (topic.name === 'חיבור') {
        const handleSelect = (ans, idx) => {
            setSelectedAnswer(idx);
            setShowResult(false);
        };

        const handleCheck = () => {
            setShowResult(true);
        };

        return (
            <View style={styles.container}>
                <Text style={localStyles.title}>נושא: {topic.name}</Text>
                <Text style={localStyles.question}>כמה זה 2 + 3?</Text>

                {answers.map((ans, idx) => {
                    let resultMark = '';
                    if (showResult && selectedAnswer === idx) {
                        if (ans === correctAnswer) {
                            resultMark = '✔';
                        } else {
                            resultMark = '✘';
                        }
                    }
                    return (
                        <Pressable
                            key={idx}
                            onPress={() => handleSelect(ans, idx)}
                            style={[
                                localStyles.answerButton,
                                selectedAnswer === idx && localStyles.selectedAnswer
                            ]}
                        >
                            <Text style={localStyles.answerText}>
                                {ans} {resultMark}
                            </Text>
                        </Pressable>
                    );
                })}

                <Pressable onPress={handleCheck} style={localStyles.checkButton}>
                    <Text style={localStyles.checkButtonText}>בדיקה</Text>
                </Pressable>

                {showResult && (
                    <View style={{ marginTop: 20 }}>
                        {answers[selectedAnswer] === correctAnswer ? (
                            <Text style={{ color: 'green', fontSize: 18 }}>נכון מאוד!</Text>
                        ) : (
                            <Text style={{ color: 'red', fontSize: 18 }}>טעות! נסה/י שוב.</Text>
                        )}
                    </View>
                )}
            </View>
        );
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

const localStyles = StyleSheet.create({
    title: {
        fontSize: 22,
        marginBottom: 10,
        textAlign: 'center'
    },
    question: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center'
    },
    answerButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 5,
        borderRadius: 5,
        padding: 12,
        alignItems: 'center'
    },
    answerText: {
        fontSize: 18
    },
    selectedAnswer: {
        backgroundColor: '#e0f7fa'
    },
    checkButton: {
        marginTop: 10,
        backgroundColor: 'blue',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center'
    },
    checkButtonText: {
        color: 'white',
        fontSize: 18
    }
});
