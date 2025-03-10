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

    // השאלה שמגיע מהשרת
    const [question, setQuestion] = useState(null);
    // תשובה שהמשתמש בחר
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // נטען שאלה חדשה בעת כניסה/שינוי id
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
            // אם 401 => ProtectedRoute כבר יחזיר ללוגין
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

    function handleNextQuestion() {
        if (id) {
            fetchNextQuestion(id);
        }
    }

    function handleGoBack() {
        router.push('/(tabs)/MyCourses');
    }

    // אם אין topicId => אולי שגיאה
    if (!id) {
        return <Text>לא נבחר נושא</Text>;
    }

    if (!question) {
        return <Text>טוען שאלה מהשרת...</Text>;
    }

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={styles.container}>
                {/* כפתור חזרה */}
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>🔙 חזרה למסך הקורסים</Text>
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
                            {showResult && selectedAnswer === index ? (
                                ans === question.correctAnswer ? ' ✔' : ' ✘'
                            ) : ''}
                        </Text>
                    </Pressable>
                ))}

                <Pressable onPress={handleCheckAnswer} style={styles.checkButton}>
                    <Text style={styles.checkButtonText}>בדיקה</Text>
                </Pressable>

                {showResult && (
                    <Text style={styles.resultText}>
                        {isCorrect ? 'תשובה נכונה!' : `תשובה שגויה! תשובה נכונה היא ${question.correctAnswer}`}
                    </Text>
                )}

                <Pressable onPress={handleNextQuestion} style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>שאלה הבאה</Text>
                </Pressable>
            </View>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 20
    },
    backButton: {
        position: 'absolute', top: 20, left: 10
    },
    backButtonText: { fontSize: 16, color: 'blue' },
    title: { fontSize: 24, marginBottom: 20 },
    question: { fontSize: 20, marginBottom: 20 },
    answerButton: {
        padding: 15, borderWidth: 1, borderRadius: 10,
        marginVertical: 5, width: '80%', alignSelf: 'center'
    },
    selectedAnswer: {
        backgroundColor: '#ddd'
    },
    answerText: {
        fontSize: 18
    },
    checkButton: {
        marginTop: 20, backgroundColor: '#4CAF50', padding: 15, borderRadius: 10,
        alignItems: 'center'
    },
    checkButtonText: { color: 'white', fontSize: 18 },
    resultText: { fontSize: 18, marginTop: 10, textAlign: 'center' },
    nextButton: {
        marginTop: 20, backgroundColor: '#2196F3', padding: 15, borderRadius: 10,
        alignItems: 'center'
    },
    nextButtonText: { color: 'white', fontSize: 18 }
});
