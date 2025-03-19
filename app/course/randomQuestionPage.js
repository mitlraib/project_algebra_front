import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cookies from 'js-cookie';

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
            if (err.response && err.response.status === 401) {
                Cookies.remove('userToken');
                router.replace('/authentication/Login');
            }
        }
    }

    async function handleCheckAnswer() {
        if (selectedAnswer === null) return;
        try {
            const res = await axios.post('/api/exercises/answer', {
                answer: question.answers[selectedAnswer]
            });
            setIsCorrect(res.data.isCorrect);
            setShowResult(true);
        } catch (err) {
            console.log("Error checking answer:", err);
            if (err.response && err.response.status === 401) {
                Cookies.remove('userToken');
                router.replace('/authentication/Login');
            }
        }
    }

    function handleNext() {
        fetchRandomQuestion();
    }

    function handleGoBack() {
        router.push('/Dashboard');
    }

    if (!question) {
        return (
            <ProtectedRoute requireAuth={true}>
                <View style={[styles.container, styles.centerAll]}>
                    <Text>טוען שאלה רנדומלית...</Text>
                </View>
            </ProtectedRoute>
        );
    }

    let displayAnswers = [];
    let correctDisplay = '';
    if (typeof question.first === 'string' && question.first.includes('/')) {
        // המרת תשובות של שברים
        displayAnswers = question.answers.map((encoded) => {
            const num = Math.floor(encoded / 1000);
            const den = encoded % 1000;
            return `${num}/${den}`;
        });
        const c = question.correctAnswer;
        const num = Math.floor(c / 1000);
        const den = c % 1000;
        correctDisplay = `${num}/${den}`;
    } else {
        // רגיל
        displayAnswers = question.answers;
        correctDisplay = question.correctAnswer;
    }

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={[styles.container, styles.centerAll]}>

                {/* שינוי קטן: אייקון חזרה - 🔙 */}
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>🔙 חזור לדף הבית</Text>
                </Pressable>

                <Text style={styles.question}>
                    {question.first} {convertSign(question.operationSign)} {question.second} = ?
                </Text>

                {displayAnswers.map((ans, index) => (
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
                                ? ans === correctDisplay
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
                            : `תשובה שגויה! התשובה הנכונה היא ${correctDisplay}`
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

function convertSign(sign) {
    switch (sign) {
        case 'fracAdd': return '+';
        case 'fracSub': return '-';
        case 'fracMul': return '×';
        case 'fracDiv': return '÷';
        default: return sign;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    centerAll: {
        alignItems: 'center',
        justifyContent: 'center'
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
        marginTop: 60,
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    answerButton: {
        padding: 8,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center'
    },
    selectedAnswer: {
        backgroundColor: '#ddd'
    },
    answerText: {
        fontSize: 18
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
