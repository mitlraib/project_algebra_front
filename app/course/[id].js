import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View, Pressable, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cookies from 'js-cookie';
import styles from '../../styles/styles.js';
import ConfettiCannon from 'react-native-confetti-cannon';
import BedidesVisualization from '@/components/BedidesVisualization'; // 👈 ייבוא הקומפוננטה

export default function CoursePage() {
    const { id } = useLocalSearchParams();   // topicId
    const router = useRouter();

    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    // קונפטי ומודאל עלייה ברמה
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // סעיף 5: בדידים
    const [myTopicLevel, setMyTopicLevel] = useState(1);
    const [showSolution, setShowSolution] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTopicLevel(id);
            fetchNextQuestion(id);
        }
    }, [id]);

    async function fetchTopicLevel(topicId) {
        try {
            const res = await axios.get('/api/user/topics-levels');
            if (res.data.success) {
                const found = res.data.topics.find(t => t.topicId == topicId);
                if (found) setMyTopicLevel(found.level);
            }
        } catch (err) {
            console.log("Error fetchTopicLevel:", err);
        }
    }

    async function fetchNextQuestion(topicId) {
        try {
            const res = await axios.get(`/api/exercises/next?topicId=${topicId}`);
            setQuestion(res.data);
            setSelectedAnswer(null);
            setShowResult(false);
            setResponseMessage('');
            setShowLevelUpModal(false);
            setShowConfetti(false);
            setShowSolution(false);
        } catch (err) {
            console.log("Error fetching question:", err);
            if (err.response && err.response.status === 401) {
                Cookies.remove('userToken');
                router.replace('/authentication/Login');
            }
        }
    }

    async function handleCheckAnswer() {
        if (selectedAnswer === null) {
            alert("יש לבחור תשובה תחילה.");
            return;
        }

        try {
            const userAnswerValue = question.answers[selectedAnswer];
            const res = await axios.post('/api/exercises/answer', { answer: userAnswerValue });

            setShowResult(true);

            if (res.data.isCorrect) {
                if (res.data.levelUpMessage) {
                    setResponseMessage(`תשובה נכונה! ${res.data.levelUpMessage}`);
                    setShowLevelUpModal(true);
                    setShowConfetti(true);
                } else {
                    setResponseMessage(`תשובה נכונה! רמה נוכחית: ${res.data.currentLevel}`);
                }
            } else {
                let correctDisplay;
                if (typeof question.first === 'string' && question.first.includes('/')) {
                    const c = res.data.correctAnswer || question.correctAnswer;
                    const num = Math.floor(c / 1000);
                    const den = c % 1000;
                    correctDisplay = `${num}/${den}`;
                } else {
                    correctDisplay = question.correctAnswer;
                }
                setResponseMessage(`תשובה שגויה! התשובה הנכונה היא ${correctDisplay}`);
            }
        } catch (err) {
            console.log("Error checking answer:", err);
            setResponseMessage("שגיאה, אנא נסה שוב.");
            if (err.response && err.response.status === 401) {
                Cookies.remove('userToken');
                router.replace('/authentication/Login');
            }
        }
    }

    function handleNextQuestion() {
        if (!showResult) {
            alert("יש לבדוק את התשובה לפני שעוברים לשאלה הבאה.");
            return;
        }
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

    // המרת תשובות
    let displayAnswers;
    if (typeof question.first === 'string' && question.first.includes('/')) {
        displayAnswers = question.answers.map((encoded) => {
            const num = Math.floor(encoded / 1000);
            const den = encoded % 1000;
            return `${num}/${den}`;
        });
    } else {
        displayAnswers = question.answers;
    }

    const showHelpButton = (id == 1 || id == 2) && (myTopicLevel <= 2);

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
                        <Text style={styles.answerText}>{ans}</Text>
                    </Pressable>
                ))}

                <Pressable onPress={handleCheckAnswer} style={styles.checkButton}>
                    <Text style={styles.checkButtonText}>בדיקה</Text>
                </Pressable>

                {responseMessage ? (
                    <Text style={styles.resultText}>{responseMessage}</Text>
                ) : null}

                <Pressable
                    onPress={handleNextQuestion}
                    style={[styles.nextButton, (!showResult) && { opacity: 0.5 }]}
                >
                    <Text style={styles.nextButtonText}>שאלה הבאה</Text>
                </Pressable>

                {/* כפתור "איך פותרים?" */}
                {showHelpButton && (
                    <Pressable
                        style={{ marginTop: 20, backgroundColor: '#EEE', padding: 10, borderRadius: 5 }}
                        onPress={() => setShowSolution(!showSolution)}
                    >
                        <Text style={{ color: 'blue' }}>
                            {showSolution ? 'הסתר פתרון בדידים' : 'איך פותרים? (בדידים)'}
                        </Text>
                    </Pressable>
                )}

                {/* הצגת הבדידים בפועל */}
                {showSolution && (
                    <View style={{ marginTop: 20 }}>
                        <Text>המחשה בבדידים:</Text>
                        <BedidesVisualization
                            firstNum={Number(question.first)}
                            secondNum={Number(question.second)}
                            operation={id == 1 ? 'add' : 'sub'}
                        />
                    </View>
                )}

                {showConfetti && (
                    <ConfettiCannon
                        count={150}
                        origin={{ x: 200, y: 0 }}
                        fadeOut={true}
                        autoStart={true}
                    />
                )}

                <Modal visible={showLevelUpModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>כל הכבוד!</Text>
                            <Text style={styles.modalText}>עלית רמה!</Text>
                            <Pressable onPress={() => setShowLevelUpModal(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>סגור</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
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
