import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { courses } from '../../constants/CoursesNames';
import styles from '../../styles/styles';

export default function CoursePage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
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
        let first = getRandomNumber();
        let second = getRandomNumber();
        let correctAnswer = 42; // התשובה לחיים, ליקום ולהכל
        if (topic.name === 'חיבור') {
            correctAnswer = first + second;
        }
        if (topic.name === 'חיסור') {
            correctAnswer = first >= second ? first - second : second - first;
        }
        if (topic.name === 'כפל') {
            correctAnswer = first * second;
        }
        if (topic.name === 'חילוק') {
            // מוודאים שהמנה תהיה מספר שלם
            correctAnswer = getRandomNumber(); // בוחרים מנה שלמה אקראית
            second = getRandomNumber(); // בוחרים מחלק אקראי
            first = correctAnswer * second; // יוצרים מספר ראשון כך שיתחלק בדיוק
        }

        const answers = [correctAnswer, correctAnswer + 1, correctAnswer - 1, correctAnswer + 5].sort(() => Math.random() - 0.5);
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

    const handleGoBack = () => {
        router.push('/(tabs)/MyCourses'); // נווט חזרה לדף בחירת נושא
    };

    return (
        <View style={styles.container}>
            {/* כפתור חזרה קטן למעלה בצד ימין */}
            <Pressable onPress={handleGoBack} style={localStyles.backButton}>
                <Text style={localStyles.backButtonArrow}>⬅</Text>
                <Text style={localStyles.backButtonText}>חזרה לבחירת נושא</Text>
            </Pressable>

            <Text style={localStyles.title}>נושא: {topic.name}</Text>
            <Text style={localStyles.question}>
                {topic.name === 'חיבור'
                    ? `כמה זה ${currentQuestion.first} + ${currentQuestion.second}?`
                    : topic.name === 'חיסור'
                        ? currentQuestion.first >= currentQuestion.second
                            ? ` כמה זה ${currentQuestion.second} - ${currentQuestion.first}?`
                            : ` כמה זה ${currentQuestion.first} - ${currentQuestion.second}?`
                        :topic.name === 'כפל'
                            ? `כמה זה ${currentQuestion.first} * ${currentQuestion.second}?`
                            : topic.name === 'חילוק'
                                ? `כמה זה ${currentQuestion.second} ÷ ${currentQuestion.first}?`
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
                        disabled={showResult}
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
        backgroundColor: 'gray'
    },
    backButton: {
        position: 'absolute',
        flexDirection:"row",
        top: 10, // מרחק מהחלק העליון
        left: 10, // הצמדה לצד ימין
        backgroundColor: 'transparent', // שקוף
        padding: 10, // קטן יותר
        borderRadius: 5
    },
    backButtonArrow: {
        fontSize: 30, // קטן
        color: 'black',
        paddingRight: 15,

    },
    backButtonText: {
        fontSize: 16, // קטן
        color: 'black',
        paddingTop: 10,

    }
});
