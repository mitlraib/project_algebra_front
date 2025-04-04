import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    Modal,
    Animated,
    Vibration,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ConfettiCannon from "react-native-confetti-cannon";
import ProtectedRoute from "@/components/ProtectedRoute";
import BedidesVisualization from "@/components/BedidesVisualization";
import Cookies from "js-cookie";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";

// קומפוננטה להצגת שבר (שאלות שבר)
function Fraction({ numerator, denominator }) {
    return (
        <View style={{ alignItems: 'center', marginHorizontal: 4 }}>
            <Text style={{ fontSize: 20 }}>{numerator}</Text>
            <View style={{ height: 1, backgroundColor: 'black', width: 30, marginVertical: 2 }} />
            <Text style={{ fontSize: 20 }}>{denominator}</Text>
        </View>
    );
}

export default function StyledCoursePage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [myTopicLevel, setMyTopicLevel] = useState(1);
    const [showSolution, setShowSolution] = useState(false);
    const [history, setHistory] = useState([]);
    const [isCheckDisabled, setIsCheckDisabled] = useState(false);  // מניעה לחיצות חוזרות על "בדיקה"

    // לאנימציה של הצגת הפתרון
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // נטען מיד עם כניסה לדף: שליפת רמת נושא ושאלה ראשונה
    useEffect(() => {
        if (id) {
            fetchTopicLevel(id);
            fetchNextQuestion(id);
        }
    }, [id]);

    // אנימציה כשמראים פתרון
    useEffect(() => {
        if (showSolution) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [showSolution]);

    // שליפת רמת נושא למשתמש
    async function fetchTopicLevel(topicId) {
        try {
            const res = await axios.get("/api/user/topics-levels");
            if (res.data.success) {
                const found = res.data.topics.find((t) => t.topicId == topicId);
                if (found) setMyTopicLevel(found.level);
            }
        } catch (err) {
            console.log("Error fetchTopicLevel:", err);
        }
    }

    // בקשת שאלה חדשה
    async function fetchNextQuestion(topicId) {
        try {
            const res = await axios.get(`/api/exercises/next?topicId=${topicId}`);
            setQuestion(res.data);
            setSelectedAnswer(null);
            setShowResult(false);
            setResponseMessage("");
            setShowLevelUpModal(false);
            setShowConfetti(false);
            setShowSolution(false);
            setIsCheckDisabled(false); // מאפשר שוב בדיקה
        } catch (err) {
            if (err.response?.status === 401) {
                Cookies.remove("userToken");
                router.replace("/authentication/Login");
            }
        }
    }

    // בעת לחיצה על "בדיקה"
    async function handleCheckAnswer() {
        if (selectedAnswer === null) {
            alert("יש לבחור תשובה תחילה.");
            return;
        }
        if (isCheckDisabled) {
            // כבר בדקנו - לא מאפשרים שוב
            return;
        }
        setIsCheckDisabled(true);

        try {
            const userAnswerValue = question.answers[selectedAnswer];
            const res = await axios.post("/api/exercises/answer", { answer: userAnswerValue });
            setShowResult(true);

            const correct = res.data.isCorrect;
            const correctAnswer = res.data.correctAnswer || question.correctAnswer;

            // אם זה שבר מקודד (num*1000+den), מפענחים לפורמט "מונה/מכנה"
            let correctDisplay = correctAnswer;
            const isFraction = typeof question.first === "string" && question.first.includes("/");
            if (isFraction) {
                const num = Math.floor(correctAnswer / 1000);
                const den = correctAnswer % 1000;
                correctDisplay = `${num}/${den}`;
            }

            // האם תשובה נכונה
            if (correct) {
                setResponseMessage(`תשובה נכונה! רמה נוכחית: ${res.data.currentLevel}`);
                if (res.data.levelUpMessage) {
                    // הודעה על עליית רמה
                    setResponseMessage(`תשובה נכונה! ${res.data.levelUpMessage}`);
                    setShowLevelUpModal(true);
                    setShowConfetti(true);
                }
            } else {
                // תשובה שגויה
                setResponseMessage(`תשובה שגויה! התשובה הנכונה היא ${correctDisplay}`);
                Vibration.vibrate(200);
            }

            // מוסיפים להיסטוריה
            setHistory((prev) => [
                ...prev,
                {
                    question: question.questionText ||
                        `${question.first} ${convertSign(question.operationSign)} ${question.second}`,
                    userAnswer: question.answers[selectedAnswer],
                    correct,
                },
            ]);
        } catch (err) {
            setResponseMessage("שגיאה, נסה שוב.");
        }
    }

    // כפתור "שאלה הבאה"
    function handleNextQuestion() {
        if (!showResult) {
            alert("בדוק את התשובה לפני מעבר");
            return;
        }
        if (id) fetchNextQuestion(id);
    }

    // עזר לזיהוי סימן הפעולה
    function convertSign(sign) {
        switch (sign) {
            case "fracAdd":
            case "frac+":
            case "add":
            case "+":
                return "+";
            case "fracSub":
            case "frac-":
            case "sub":
            case "-":
                return "-";
            case "fracMul":
            case "frac*":
            case "mul":
            case "*":
                return "×";
            case "fracDiv":
            case "frac/":
            case "div":
            case "/":
                return "÷";
            default:
                return sign;
        }
    }

    // פתרון חיבור/חיסור רגיל (Bedides) כאשר small numbers
    function renderBedidesExplanation() {
        const operationWord = id == 1 ? "נוסיף" : "נחסיר";
        return (
            <Animated.View style={[styles.explanation, { opacity: fadeAnim }]}>
                <Text style={styles.explanationText}>
                    נניח שיש לנו {question.first} כדורים, {operationWord} {question.second}
                </Text>
                <BedidesVisualization
                    firstNum={Number(question.first)}
                    secondNum={Number(question.second)}
                    operation={id == 1 ? "add" : "sub"}
                />
                <Text style={styles.explanationText}>
                    ונקבל {eval(`${question.first}${convertSign(question.operationSign)}${question.second}`)} כדורים.
                </Text>
            </Animated.View>
        );
    }

    // פתרון חיבור/חיסור רגיל (מאונך) כאשר large numbers
    function renderVerticalSolution() {
        const sign = convertSign(question.operationSign);
        const first = Number(question.first);
        const second = Number(question.second);
        const result = eval(`${first}${sign}${second}`);
        return (
            <Animated.View style={[styles.explanation, { opacity: fadeAnim }]}>
                <Text style={styles.explanationText}>פתרון במאונך:</Text>
                <Text style={[styles.explanationText, { textAlign: 'right', marginTop: 10 }]}>
                    {`
    ${first}
${sign}   ${second}
---------
    ${result}
                    `}
                </Text>
            </Animated.View>
        );
    }

    // עבור שאלה מילולית (word): אם < 20 => בידידים, אחרת מאונך
    function renderWordBedidesSolution() {
        // כאן נתבסס על השדות שהוספנו ב-ExerciseService: wordA, wordB, wordSign
        const a = question.wordA;
        const b = question.wordB;
        // אם לא הגיעה wordSign, נשתמש ב-+/- מההפרש
        const sign = question.wordSign === "-" ? "נחסיר" : "נוסיף";

        return (
            <Animated.View style={[styles.explanation, { opacity: fadeAnim }]}>
                <Text style={styles.explanationText}>
                    נניח שיש לנו {a} פריטים, {sign} {b}
                </Text>
                <BedidesVisualization
                    firstNum={a}
                    secondNum={b}
                    operation={question.wordSign === "+" ? "add" : "sub"}
                />
                <Text style={styles.explanationText}>
                    ונקבל {question.correctAnswer} פריטים.
                </Text>
            </Animated.View>
        );
    }

    function renderWordVerticalSolution() {
        const a = question.wordA;
        const b = question.wordB;
        const sign = question.wordSign === "-" ? "-" : "+";
        const result = question.correctAnswer;

        return (
            <Animated.View style={[styles.explanation, { opacity: fadeAnim }]}>
                <Text style={styles.explanationText}>פתרון במאונך (שאלה מילולית):</Text>
                <Text style={[styles.explanationText, { textAlign: 'right', marginTop: 10 }]}>
                    {`
    ${a}
${sign}   ${b}
---------
    ${result}
                    `}
                </Text>
            </Animated.View>
        );
    }

    // במקרה שלא נטען כלום (בעיה או עדיין טוען)
    if (!id || !question) {
        return <Text style={styles.loading}>טוען...</Text>;
    }

    // זיהוי אם זו שאלה שבר
    const isFractionQuestion = (typeof question.operationSign === 'string') && question.operationSign.startsWith("frac");

    // אם זו שאלה שבר - נפענח תשובות למחרוזת "מונה/מכנה"
    let displayAnswers = question.answers;
    if (isFractionQuestion) {
        displayAnswers = question.answers.map((encoded) => {
            const num = Math.floor(encoded / 1000);
            const den = encoded % 1000;
            return `${num}/${den}`;
        });
    }

    // בדיקה אם הנושא הוא חיבור/חיסור פשוט (id==1,2) - משמש לפתרון מילולי בגרסה הקודמת
    const isAddOrSub = (id == 1 || id == 2);
    const isBedides = myTopicLevel <= 2;  // רמה

    // פונקציה מרכזית להצגת פתרון
    function renderSolution() {
        // אם עדיין לא ביקשו להראות פתרון או שהתשובה עוד לא נבדקה => לא מציגים
        if (!showResult || !showSolution) return null;

        // קודם כל בודקים אם זו שאלה מילולית
        if (question.operationSign === 'word') {
            // אם correctAnswer < 20 => בידידים, אחרת מאונך
            if (question.correctAnswer < 20) {
                return renderWordBedidesSolution();
            } else {
                return renderWordVerticalSolution();
            }
        }

        // אם זו שאלה רגילה (חיבור/חיסור) => בדיקת רמה
        if (isAddOrSub && !isFractionQuestion) {
            if (isBedides) {
                return renderBedidesExplanation();
            } else {
                return renderVerticalSolution();
            }
        }
        // אחרת (כפל/חילוק/שבר...) אין כרגע פתרון ויזואלי אצלנו
        return null;
    }

    // האם להציג כפתור "איך פותרים?"
    // - לא מציגים בשברים; נניח שרק בחיבור/חיסור או word
    const showHelpButton =
        (isAddOrSub && !isFractionQuestion) || // חיבור/חיסור רגיל
        (question.operationSign === 'word');   // שאלה מילולית

    return (
        <ProtectedRoute requireAuth={true}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* איזור הצגת השאלה */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    {/* אם זו שאלה מילולית */}
                    {question.operationSign === 'word' ? (
                        <Text style={[styles.title, { textAlign: 'center' }]}>
                            {question.questionText}
                        </Text>
                    ) : (
                        // אחרת שאלה רגילה (כולל כפל/חילוק)
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* מציגים את המספר הראשון (או שבר) */}
                            {isFractionQuestion && typeof question.first === "string" && question.first.includes('/') ? (
                                <Fraction
                                    numerator={question.first.split('/')[0]}
                                    denominator={question.first.split('/')[1]}
                                />
                            ) : (
                                <Text style={styles.title}>{question.first}</Text>
                            )}

                            <Text style={{ fontSize: 20, marginHorizontal: 8 }}>
                                {convertSign(question.operationSign)}
                            </Text>

                            {/* מציגים את המספר השני (או שבר) */}
                            {isFractionQuestion && typeof question.second === "string" && question.second.includes('/') ? (
                                <Fraction
                                    numerator={question.second.split('/')[0]}
                                    denominator={question.second.split('/')[1]}
                                />
                            ) : (
                                <Text style={styles.title}>{question.second}</Text>
                            )}

                            <Text style={{ fontSize: 20, marginLeft: 8 }}>= ?</Text>
                        </View>
                    )}
                </View>

                {/* תשובות לבחירה */}
                {displayAnswers.map((ans, idx) => {
                    // האם התשובה עצמה היא מחרוזת בצורת שבר
                    const isAnsFraction = typeof ans === 'string' && ans.includes('/');
                    const [num, den] = isAnsFraction ? ans.split('/') : [];

                    return (
                        <Pressable
                            key={idx}
                            style={[
                                styles.answerButton,
                                selectedAnswer === idx && styles.selectedAnswer
                            ]}
                            onPress={() => !showResult && setSelectedAnswer(idx)}
                            disabled={showResult}
                        >
                            <View style={{ alignItems: 'center' }}>
                                {isAnsFraction ? (
                                    <Fraction numerator={num} denominator={den} />
                                ) : (
                                    <Text style={styles.answerText}>{ans}</Text>
                                )}
                            </View>
                        </Pressable>
                    );
                })}

                {/* כפתור בדיקה */}
                <Pressable
                    onPress={handleCheckAnswer}
                    style={[styles.checkButton, isCheckDisabled && { opacity: 0.5 }]}
                    disabled={isCheckDisabled}
                >
                    <Text style={styles.primaryText}>בדיקה</Text>
                </Pressable>

                {/* משוב לאחר הבדיקה (תשובה נכונה/שגויה) */}
                {responseMessage !== '' && (
                    <Text style={styles.feedback}>{responseMessage}</Text>
                )}

                {/* כפתור שאלה הבאה */}
                <Pressable onPress={handleNextQuestion} style={styles.secondaryButton}>
                    <Text style={styles.secondaryText}>שאלה הבאה</Text>
                </Pressable>

                {/* כפתור "איך פותרים?" אם זה חיבור/חיסור או מילולי */}
                {showHelpButton && (
                    <Pressable
                        onPress={() => setShowSolution(!showSolution)}
                        style={styles.helpButton}
                        disabled={!showResult}  // רק אחרי בדיקה
                    >
                        <Text style={{ color: !showResult ? 'gray' : 'blue' }}>
                            {showSolution ? 'הסתר פתרון' : 'איך פותרים?'}
                        </Text>
                    </Pressable>
                )}

                {/* הצגת הפתרון בפועל (Bedides / מאונך / וכו'), בהתאם לסוג השאלה */}
                {renderSolution()}

                {/* קונפטי בעת עליית רמה */}
                {showConfetti && (
                    <ConfettiCannon
                        count={100}
                        origin={{ x: 200, y: 0 }}
                        fadeOut={true}
                    />
                )}

                {/* מודאל "עלית רמה" */}
                <Modal visible={showLevelUpModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>כל הכבוד!</Text>
                            <Text style={styles.modalText}>עלית רמה!</Text>
                            <Pressable
                                onPress={() => setShowLevelUpModal(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>סגור</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {/* היסטוריית תשובות */}
                <View style={{ marginTop: 30 }}>
                    <Text style={styles.sectionTitle}>היסטוריית תשובות:</Text>
                    {history.map((item, i) => (
                        <Text key={i} style={{ color: item.correct ? 'green' : 'red' }}>
                            {item.question} | ענית: {item.userAnswer} {item.correct ? '✓' : '✗'}
                        </Text>
                    ))}
                </View>

                {/* חזרה למסך הקורסים */}
                <Pressable
                    onPress={() => router.push('/MyCourses')}
                    style={[styles.finishButton, { marginTop: 40 }]}
                >
                    <Text style={styles.primaryText}>סיום תרגול</Text>
                </Pressable>
            </ScrollView>
        </ProtectedRoute>
    );
}

// סגנונות
const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingBottom: 60
    },
    title: {
        fontSize: 24,
        textAlign: "center"
    },
    answerButton: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: "#f3f4f6",
        marginBottom: 10,
    },
    selectedAnswer: {
        backgroundColor: "#c7d2fe"
    },
    answerText: {
        fontSize: 18,
        textAlign: "center"
    },
    finishButton: {
        backgroundColor: "#4F46E5",
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
    },
    checkButton: {
        backgroundColor: "#10B981",
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
    },
    primaryText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold"
    },
    secondaryButton: {
        backgroundColor: "#B5E2FF",
        padding: 14,
        borderRadius: 8,
        marginTop: 10,
    },
    secondaryText: {
        textAlign: "center",
        fontSize: 16
    },
    feedback: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 10,
        fontWeight: "bold"
    },
    helpButton: {
        marginTop: 20,
        alignItems: "center",
    },
    explanation: {
        backgroundColor: "#f9fafb",
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
    },
    explanationText: {
        fontSize: 16,
        marginBottom: 8
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalBox: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 12,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20
    },
    closeButton: {
        backgroundColor: "#4F46E5",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold"
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10
    },
    loading: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 18
    },
});
