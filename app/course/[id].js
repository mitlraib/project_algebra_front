import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { courses } from '../../constants/CoursesNames';
import styles from '../../styles/styles';

export default function CoursePage() {
    const { id } = useLocalSearchParams();
    const topic = courses.flatMap(course => course.topics).find(topic => topic.id.toString() === id);

    const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    // פונקציה שמגרילה מספר רנדומלי
    function getRandomNumber() {
        return Math.floor(Math.random() * 10) + 1;
    }

    // פונקציה שמייצרת שאלה חדשה
    function generateQuestion() {
        const first = getRandomNumber();
        const second = getRandomNumber();
        let correctAnswer = 42; // התשובה לחיים, ליקום ולהכל
        if (topic.name === 'חיבור') {
         correctAnswer = first + second;
            }
        if (topic.name === 'חיסור') {
            if (first>=second){correctAnswer = first - second;}
            else {correctAnswer = second-first;}
        }
        const answers = [correctAnswer, correctAnswer + 1, correctAnswer - 1, correctAnswer + 5].sort(() => Math.random() - 0.5); // ערבוב תשובות
        return { first, second, correctAnswer, answers };
    }

    if (!topic) {
        return <Text style={styles.notFound}>הנושא לא נמצא</Text>;
    }

        const handleSelect = (ans, idx) => {
            if (!showResult) { // לא ניתן לשנות תשובה אחרי בדיקה
                setSelectedAnswer(idx);
            }
        };

        const handleCheck = () => {
            if (selectedAnswer !== null) {
                setShowResult(true);
            }
        };

        const handleNextQuestion = () => {
            if (showResult && selectedAnswer !== null) { // רק אחרי שבדקו תשובה אפשר לעבור לשאלה הבאה
                setCurrentQuestion(generateQuestion());
                setSelectedAnswer(null);
                setShowResult(false);
            }
        };

        return (
            <View style={styles.container}>
                <Text style={localStyles.title}>נושא: {topic.name}</Text>
                <Text style={localStyles.question}>
                    {topic.name === 'חיבור'
                        ? `כמה זה ${currentQuestion.second} + ${currentQuestion.first}?`
                        : topic.name === 'חיסור'
                            ? currentQuestion.first>=currentQuestion.second?
                                ` כמה זה ${currentQuestion.second} - ${currentQuestion.first}?`
                                :
                            ` כמה זה ${currentQuestion.first} - ${currentQuestion.second}?`
                            : "לא"}
                </Text>


                {currentQuestion.answers.map((ans, idx) => {
                    let resultMark = '';
                    if (showResult && selectedAnswer === idx) {
                        resultMark = ans === currentQuestion.correctAnswer ? '✔' : '✘';
                    }
                    return (
                        <Pressable
                            key={idx}
                            onPress={() => handleSelect(ans, idx)}
                            disabled={showResult} // חוסם שינוי תשובה אחרי בדיקה
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

                <Pressable onPress={handleCheck} style={localStyles.checkButton} disabled={showResult || selectedAnswer === null}>
                    <Text style={localStyles.checkButtonText}>בדיקה</Text>
                </Pressable>

                {showResult && (
                    <View style={{ marginTop: 20 }}>
                        {currentQuestion.answers[selectedAnswer] === currentQuestion.correctAnswer ? (
                            <Text style={{ color: 'green', fontSize: 18 }}>נכון מאוד!</Text>
                        ) : (
                            <Text style={{ color: 'red', fontSize: 18 }}>טעות! לא נורא, תצליח בפעם הבאה...</Text>
                        )}
                    </View>
                )}

                <Pressable onPress={handleNextQuestion} style={[localStyles.nextButton, (!showResult || selectedAnswer === null) && localStyles.disabledButton]} disabled={!showResult || selectedAnswer === null}>
                    <Text style={localStyles.nextButtonText}>שאלה הבאה</Text>
                </Pressable>
            </View>
        );


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
    },
    nextButton: {
        marginTop: 10,
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center'
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18
    },
    disabledButton: {
        backgroundColor: 'gray' // כפתור מושבת יופיע בצבע אפור
    }
});
