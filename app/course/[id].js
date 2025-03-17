import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

export default function CoursePage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // בכל פעם שמשתנה id -> נטען שאלה חדשה
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

    // אם זה שבר => נצטרך להמיר את התשובות ל-String (X/Y)
    // כי בשרת שמרנו מקודד (num*1000+den). נבדוק אם question.answers הם int[] שעשויים להיות > 999?
    let displayAnswers = [];
    if (typeof question.first === 'string' && question.first.includes('/')) {
        // כנראה שברי
        displayAnswers = question.answers.map((encoded) => {
            // encoded = num*1000 + den
            const num = Math.floor(encoded / 1000);
            const den = encoded % 1000;
            return `${num}/${den}`;
        });
    } else {
        // מקרה רגיל
        displayAnswers = question.answers;
    }

    // מומר גם התשובה הנכונה
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
        marginTop: 70,
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    answerButton: {
        padding: 8,
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
        fontSize: 16,
        textAlign: 'center',
        flexWrap: 'wrap'
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
