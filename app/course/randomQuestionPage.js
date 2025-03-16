import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import ProtectedRoute from '@/components/ProtectedRoute';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

export default function RandomQuestionPage() {
    const router = useRouter();
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        fetchRandomQuestion();
    }, []);

    async function fetchRandomQuestion() {
        try {
            const res = await axios.get('/api/exercises/next-random');
            setQuestion(res.data);
            setSelectedAnswer(null);
            setShowResult(false);
            setIsCorrect(false);
        } catch (err) {
            console.log("Error fetching random question:", err);
        }
    }

    async function handleCheckAnswer() {
        if (selectedAnswer === null) return;
        try {
            // שולחים בקשה לשרת לבדוק את התשובה
            const res = await axios.post('/api/exercises/answer', {
                answer: question.answers[selectedAnswer]
            });
            console.log("Check answer result:", res.data);
            setIsCorrect(res.data.isCorrect);
            setShowResult(true);
        } catch (err) {
            console.log("Error checking answer:", err);
        }
    }

    function handleNext() {
        // מושך שאלה חדשה רנדומלית
        fetchRandomQuestion();
    }

    function handleGoBack() {
        router.push('/(tabs)/Dashboard');
    }

    if (!question) {
        return (
            <ProtectedRoute requireAuth={true}>
                <View style={styles.container}>
                    <Text>טוען שאלה רנדומלית...</Text>
                </View>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={styles.container}>
                {/* כפתור חזרה */}
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>חזור לדף הבית</Text>
                </Pressable>

                <Text style={styles.question}>
                    {question.first} {question.operationSign} {question.second} = ?
                </Text>

                {question.answers.map((ans, index) => (
                    <Pressable
                        key={index}
                        onPress={() => {
                            if (!showResult) setSelectedAnswer(index);
                        }}
                        style={[
                            styles.answerButton,
                            selectedAnswer === index && styles.selectedAnswer
                        ]}
                        disabled={showResult}
                    >
                        <Text style={styles.answerText}>
                            {ans}
                            {showResult && selectedAnswer === index
                                ? ans === question.correctAnswer
                                    ? ' ✔'
                                    : ' ✘'
                                : ''
                            }
                        </Text>
                    </Pressable>
                ))}

                <Pressable onPress={handleCheckAnswer} style={styles.checkButton}>
                    <Text style={styles.checkButtonText}>בדיקה</Text>
                </Pressable>

                {showResult && (
                    <Text style={styles.resultText}>
                        {isCorrect
                            ? 'תשובה נכונה!'
                            : `תשובה שגויה! התשובה הנכונה היא ${question.correctAnswer}`
                        }
                    </Text>
                )}

                <Pressable onPress={handleNext} style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>שאלה רנדומלית הבאה</Text>
                </Pressable>
            </View>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 10
    },
    backButtonText: {
        fontSize: 16,
        color: 'blue'
    },
    question: {
        fontSize: 20,
        marginBottom: 20,
        marginTop: 60
    },
    answerButton: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
        width: '80%',
        alignSelf: 'center'
    },
    selectedAnswer: {
        backgroundColor: '#ddd'
    },
    answerText: {
        fontSize: 18,
        textAlign: 'center'
    },
    checkButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    checkButtonText: {
        color: 'white',
        fontSize: 18
    },
    resultText: {
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center'
    },
    nextButton: {
        marginTop: 20,
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18
    }
});
