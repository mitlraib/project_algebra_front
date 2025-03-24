import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cookies from 'js-cookie';
import styles from '../../styles/styles.js';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function RandomQuestionPage() {
    const router = useRouter();
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        fetchRandomQuestion();
    }, []);

    async function fetchRandomQuestion() {
        try {
            const res = await axios.get('/api/exercises/next-random');
            setQuestion(res.data);
            setSelectedAnswer(null);
            setShowResult(false);
            setResponseMessage('');
            setShowLevelUpModal(false);
            setShowConfetti(false);
        } catch (err) {
            console.log("Error fetching random question:", err);
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

    function handleNext() {
        if (!showResult) {
            alert("יש לבדוק את התשובה לפני שעוברים לשאלה הבאה.");
            return;
        }
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

    // המרת התשובות לשבר:
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

    function convertSign(sign) {
        switch (sign) {
            case 'fracAdd': return '+';
            case 'fracSub': return '-';
            case 'fracMul': return '×';
            case 'fracDiv': return '÷';
            default: return sign;
        }
    }

    function renderValue(value) {
        if (typeof value === 'string' && value.includes('/')) {
            const [num, den] = value.split('/');
            return (
                <View style={fractionStyles.fractionContainer}>
                    <Text style={fractionStyles.fractionNumerator}>{num}</Text>
                    <View style={fractionStyles.fractionLine} />
                    <Text style={fractionStyles.fractionDenominator}>{den}</Text>
                </View>
            );
        } else {
            return <Text>{value}</Text>;
        }
    }

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={[styles.container, styles.centerAll]}>
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>🔙 חזור לדף הבית</Text>
                </Pressable>

                {/* הצגת השאלה */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                    {renderValue(question.first)}
                    <Text style={{ fontSize: 20, marginHorizontal: 5 }}>{convertSign(question.operationSign)}</Text>
                    {renderValue(question.second)}
                    <Text style={{ fontSize: 20, marginLeft: 5 }}>= ?</Text>
                </View>

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
                        <View style={{ alignItems: 'center' }}>
                            {renderValue(ans)}
                        </View>
                    </Pressable>
                ))}

                <Pressable onPress={handleCheckAnswer} style={styles.checkButton}>
                    <Text style={styles.checkButtonText}>בדיקה</Text>
                </Pressable>

                {responseMessage ? (
                    <Text style={styles.resultText}>{responseMessage}</Text>
                ) : null}

                <Pressable onPress={handleNext} style={[styles.nextButton, (!showResult) && { opacity: 0.5 }]}>
                    <Text style={styles.nextButtonText}>שאלה רנדומלית הבאה</Text>
                </Pressable>

                {showConfetti && (
                    <ConfettiCannon
                        count={150}
                        origin={{ x: 200, y: 0 }}
                        fadeOut={true}
                        autoStart={true}
                    />
                )}

                <Modal visible={showLevelUpModal} transparent animationType="slide">
                    <View style={modalStyles.modalOverlay}>
                        <View style={modalStyles.modalBox}>
                            <Text style={modalStyles.modalTitle}>כל הכבוד!</Text>
                            <Text style={modalStyles.modalText}>עלית רמה!</Text>
                            <Pressable onPress={() => setShowLevelUpModal(false)} style={modalStyles.closeButton}>
                                <Text style={modalStyles.closeButtonText}>סגור</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </ProtectedRoute>
    );
}

const fractionStyles = StyleSheet.create({
    fractionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5
    },
    fractionNumerator: {
        fontSize: 20,
        textAlign: 'center',
    },
    fractionLine: {
        width: 30,
        height: 1,
        backgroundColor: 'black',
        marginVertical: 2
    },
    fractionDenominator: {
        fontSize: 20,
        textAlign: 'center',
    },
});

const modalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 15,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
