import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cookies from 'js-cookie';
import styles from '../../styles/styles.js';


export default function CoursePage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        if (id) {
            fetchNextQuestion(id);
        }
    }, [id]);

    async function fetchNextQuestion(topicId) {
        try {
            const res = await axios.get(`/api/exercises/next?topicId=${topicId}`);
            setQuestion(res.data);
            setSelectedAnswer(null);
            setShowResult(false);
            setIsCorrect(false);
        } catch (err) {
            console.log("Error fetching question:", err);
            // אם מקבלים 401 – ננתק ונעביר לדף התחברות
            if (err.response && err.response.status === 401) {
                Cookies.remove('userToken');
                router.replace('/authentication/Login');
            }
        }
    }

    // async function handleCheckAnswer() {
    //     if (selectedAnswer === null) return;
    //     try {
    //         const res = await axios.post('/api/exercises/answer', {
    //             answer: question.answers[selectedAnswer]
    //         });
    //         setIsCorrect(res.data.isCorrect);
    //         setShowResult(true);
    //     } catch (err) {
    //         console.log("Error checking answer:", err);
    //         if (err.response && err.response.status === 401) {
    //             Cookies.remove('userToken');
    //             router.replace('/authentication/Login');
    //         }
    //     }
    // }
    async function handleCheckAnswer() {
        if (selectedAnswer === null) return;
        try {
            const res = await axios.post('/api/exercises/answer', {
                answer: question.answers[selectedAnswer]
            });
            setIsCorrect(res.data.isCorrect);
            setShowResult(true);

            // הצגת הודעת העלאת רמה אם קיימת
            if (res.data.levelUpMessage) {
                alert(res.data.levelUpMessage); // הצגת הודעה בעזרת alert
            }
        } catch (err) {
            console.log("Error checking answer:", err);
            if (err.response && err.response.status === 401) {
                Cookies.remove('userToken');
                router.replace('/authentication/Login');
            }
        }
    }

    function handleNextQuestion() {
        if (id) {
            fetchNextQuestion(id);
        }
    }

    function handleGoBack() {
        router.push('/MyCourses');
    }

    if (!id) {
        return <Text>לא נבחר נושא</Text>;
    }
    if (!question) {
        return <Text>טוען שאלה מהשרת...</Text>;
    }

    // המרת תשובות (למקרה של שברים)
    let displayAnswers = [];
    if (typeof question.first === 'string' && question.first.includes('/')) {
        displayAnswers = question.answers.map((encoded) => {
            const num = Math.floor(encoded / 1000);
            const den = encoded % 1000;
            return `${num}/${den}`;
        });
    } else {
        displayAnswers = question.answers;
    }

    // גם לתשובה הנכונה
    let correctDisplay = '';
    if (typeof question.first === 'string' && question.first.includes('/')) {
        const c = question.correctAnswer;
        const num = Math.floor(c / 1000);
        const den = c % 1000;
        correctDisplay = `${num}/${den}`;
    } else {
        correctDisplay = question.correctAnswer;
    }

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={styles.container}>
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>🔙 חזרה למסך הקורסים</Text>
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
                            {showResult && selectedAnswer === index ? (
                                ans === correctDisplay ? ' ✔' : ' ✘'
                            ) : ''}
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

                <Pressable onPress={handleNextQuestion} style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>שאלה הבאה</Text>
                </Pressable>
            </View>
        </ProtectedRoute>
    );
}

function convertSign(sign) {
    if (sign === 'fracAdd') return '+';
    if (sign === 'fracSub') return '-';
    if (sign === 'fracMul') return '×';
    if (sign === 'fracDiv') return '÷';
    return sign;
}

