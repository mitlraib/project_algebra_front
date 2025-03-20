import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cookies from 'js-cookie';
import { Alert } from 'react-native';
import styles from '../../styles/styles.js';


export default function RandomQuestionPage() {
    const router = useRouter();
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const [responseMessage, setResponseMessage] = useState('');


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

            console.log("Response from server:", res.data);  // חשוב לוודא שהשרת מחזיר את התוצאה

            setIsCorrect(res.data.isCorrect);
            setShowResult(true);
            setResponseMessage(`תשובה נכונה! רמה חדשה: ${res.data.currentLevel}`);  // הצגת התוצאה

        } catch (err) {
            console.log("Error checking answer:", err);
            setResponseMessage("שגיאה, אנא נסה שוב.");
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
                {/* הצגת הודעה מהשרת */}
                {responseMessage && <Text>{responseMessage}</Text>}

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


