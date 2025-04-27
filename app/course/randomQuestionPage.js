import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cookies from 'js-cookie';
import ConfettiCannon from 'react-native-confetti-cannon';
import { HomeButton } from '../(tabs)/Utils';


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
    const [answerFeedbackColor, setAnswerFeedbackColor] = useState(null);

    useEffect(() => {
        fetchRandomQuestion();
    }, []);

    async function fetchRandomQuestion() {
        try {
            const res = await axios.get('/api/exercises/next-random');

            const isFractionZero =
                typeof res.data.correctAnswer === 'number' &&
                res.data.correctAnswer === 0 &&
                res.data.operationSign?.includes('frac');

            if (isFractionZero) {
                fetchRandomQuestion(); // נטען מחדש שאלה אחרת
                return;
            }

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
                    setAnswerFeedbackColor("green"); // אם נכון

                }
            } else {
                let correctDisplay = res.data.correctAnswer;

                if (typeof correctDisplay === 'number' && correctDisplay >= 1000) {
                    const num = Math.floor(correctDisplay / 1000);
                    const den = correctDisplay % 1000;
                    if (num === den) {
                        correctDisplay = "1";
                    } else {
                        correctDisplay = `${num}/${den}`;
                    }
                }


                setResponseMessage(`תשובה שגויה! התשובה הנכונה היא ${correctDisplay}`);
                setAnswerFeedbackColor("red");   // אם שגוי

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
    function formatFraction(numerator, denominator) {
        if (numerator === 0) return "0";
        if (numerator === denominator) return "1";
        return `${numerator}/${denominator}`;
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
        // בדיקה אם הערך הוא מספר בקידוד שבר
        if (typeof value === 'number' && value >= 1000) {
            const num = Math.floor(value / 1000);
            const den = value % 1000;

            if (num === den) {
                // לדוגמה: 4004 -> 4/4 = 1
                return <Text style={{ fontSize: 20 }}>1</Text>;
            }

            return (
                <View style={fractionStyles.fractionContainer}>
                    <Text style={fractionStyles.fractionNumerator}>{num}</Text>
                    <View style={fractionStyles.fractionLine} />
                    <Text style={fractionStyles.fractionDenominator}>{den}</Text>
                </View>
            );
        }

        // אם זו מחרוזת "3/4"
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

        // אחרת – מספר רגיל
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
                <HomeButton />


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
                    <Text
                        style={{
                            color:
                                answerFeedbackColor === "green"
                                    ? "green"
                                    : answerFeedbackColor === "red"
                                        ? "red"
                                        : "black",
                            fontSize: 18,
                            fontWeight: "bold",
                            marginTop: 10,
                        }}
                    >
                        {responseMessage}
                    </Text>
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