import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cookies from 'js-cookie';
import ConfettiCannon from 'react-native-confetti-cannon';

// אפשר לייבא את styles שלכם כאן, אם יש לכם קובץ נפרד
// import styles from '../../styles/styles.js';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";

export default function RandomQuestionPage() {
    const router = useRouter();
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isCheckDisabled, setIsCheckDisabled] = useState(false);  // מניעה לחיצות חוזרות

    useEffect(() => {
        fetchRandomQuestion();
    }, []);

    async function fetchRandomQuestion() {
        try {
            const res = await axios.get('/api/exercises/next-random');
            setQuestion({
                // נשמור בדיוק את הנתונים שמגיעים
                ...res.data
            });
            setSelectedAnswer(null);
            setShowResult(false);
            setResponseMessage('');
            setShowLevelUpModal(false);
            setShowConfetti(false);
            setIsCheckDisabled(false); // מאפשרים בדיקה מחדש בשאלה הבאה
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
        if (isCheckDisabled) {
            // כבר נעשתה בדיקה, לא נאפשר שוב
            return;
        }
        setIsCheckDisabled(true);

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
                let correctDisplay = question.correctAnswer;

                // בדיקה אם מדובר בשבר מקודד (num*1000 + den)
                if (
                    question.operationSign &&
                    question.operationSign.includes("frac")
                ) {
                    const c = res.data.correctAnswer || question.correctAnswer;
                    const num = Math.floor(c / 1000);
                    const den = c % 1000;
                    correctDisplay = `${num}/${den}`;
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

    function convertSign(sign) {
        switch (sign) {
            case 'fracAdd':
            case 'frac+':
            case '+':
                return '+';
            case 'fracSub':
            case 'frac-':
            case '-':
                return '-';
            case 'fracMul':
            case 'frac*':
            case '*':
                return '×';
            case 'fracDiv':
            case 'frac/':
            case '/':
                return '÷';
            default:
                return sign;
        }
    }

    // פונקציה להצגת ערך כטקסט או כשבר מפוענח
    function renderValue(value) {
        // אם זה אובייקט שבר מקודד (למשל 3004 => 3/4)
        if (
            question.operationSign &&
            question.operationSign.includes("frac") &&
            typeof value === 'number'
        ) {
            const num = Math.floor(value / 1000);
            const den = value % 1000;
            return (
                <View style={fractionStyles.fractionContainer}>
                    <Text style={fractionStyles.fractionNumerator}>{num}</Text>
                    <View style={fractionStyles.fractionLine} />
                    <Text style={fractionStyles.fractionDenominator}>{den}</Text>
                </View>
            );
        }

        // אם זו מחרוזת עם '/', כנראה שבר (נניח "3/4")
        if (typeof value === 'string' && value.includes('/')) {
            const [num, den] = value.split('/');
            return (
                <View style={fractionStyles.fractionContainer}>
                    <Text style={fractionStyles.fractionNumerator}>{num}</Text>
                    <View style={fractionStyles.fractionLine} />
                    <Text style={fractionStyles.fractionDenominator}>{den}</Text>
                </View>
            );
        }

        // אחרת מציגים טקסט רגיל
        return <Text style={{ fontSize: 20 }}>{value}</Text>;
    }

    if (!question) {
        return (
            <ProtectedRoute requireAuth={true}>
                <View style={[pageStyles.container, pageStyles.centerAll]}>
                    <Text>טוען שאלה רנדומלית...</Text>
                </View>
            </ProtectedRoute>
        );
    }

    // מכין את מערך התשובות להצגה
    const displayAnswers = question.answers || [];

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={[pageStyles.container, pageStyles.centerAll]}>
                <Pressable onPress={handleGoBack} style={pageStyles.backButton}>
                    <Text style={pageStyles.backButtonText}>🔙 חזור לדף הבית</Text>
                </Pressable>

                {/* הצגת השאלה */}
                {question.operationSign === 'word' ? (
                    <Text style={pageStyles.questionText}>
                        {question.questionText}
                    </Text>
                ) : (
                    <View style={pageStyles.questionRow}>
                        {renderValue(question.first)}
                        <Text style={pageStyles.signText}>{convertSign(question.operationSign)}</Text>
                        {renderValue(question.second)}
                        <Text style={pageStyles.signText}>= ?</Text>
                    </View>
                )}

                {/* תשובות */}
                {displayAnswers.map((ans, index) => (
                    <Pressable
                        key={index}
                        onPress={() => setSelectedAnswer(index)}
                        style={[
                            pageStyles.answerButton,
                            selectedAnswer === index && pageStyles.selectedAnswer
                        ]}
                        disabled={showResult}
                    >
                        {renderValue(ans)}
                    </Pressable>
                ))}

                {/* כפתור בדיקה */}
                <Pressable
                    onPress={handleCheckAnswer}
                    style={[pageStyles.checkButton, isCheckDisabled && { opacity: 0.5 }]}
                    disabled={isCheckDisabled}
                >
                    <Text style={pageStyles.checkButtonText}>בדיקה</Text>
                </Pressable>

                {responseMessage ? (
                    <Text style={pageStyles.resultText}>{responseMessage}</Text>
                ) : null}

                {/* כפתור לשאלה הבאה */}
                <Pressable
                    onPress={handleNext}
                    style={[pageStyles.nextButton, (!showResult) && { opacity: 0.5 }]}
                >
                    <Text style={pageStyles.nextButtonText}>שאלה רנדומלית הבאה</Text>
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
                            <Pressable
                                onPress={() => setShowLevelUpModal(false)}
                                style={modalStyles.closeButton}
                            >
                                <Text style={modalStyles.closeButtonText}>סגור</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </ProtectedRoute>
    );
}

// סגנונות לדף
const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    centerAll: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
    questionText: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    signText: {
        fontSize: 20,
        marginHorizontal: 5
    },
    answerButton: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: "#f3f4f6",
        marginBottom: 10,
        width: '100%',
        alignItems: 'center'
    },
    selectedAnswer: {
        backgroundColor: "#c7d2fe"
    },
    checkButton: {
        backgroundColor: '#10B981',
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
        width: '100%',
        alignItems: 'center'
    },
    checkButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    nextButton: {
        backgroundColor: '#4F46E5',
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
        width: '100%',
        alignItems: 'center'
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    resultText: {
        marginTop: 12,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold'
    },
});

// סגנונות לשבר
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

// סגנונות למודל
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
