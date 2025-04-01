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
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (id) {
            fetchTopicLevel(id);
            fetchNextQuestion(id);
        }
    }, [id]);

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

    async function fetchNextQuestion(topicId) {
        try {
            const res = await axios.get(`/api/exercises/next?topicId=${topicId}`);
            const questionData = res.data;


            questionData.text = generateQuestionText(
                questionData.first,
                questionData.second,
                questionData.operationSign,
                myTopicLevel
            );

            setQuestion(questionData); // <== רק אחרי שעדכנת
            setSelectedAnswer(null);
            setShowResult(false);
            setResponseMessage("");
            setShowLevelUpModal(false);
            setShowConfetti(false);
            setShowSolution(false);
        } catch (err) {
            if (err.response?.status === 401) {
                Cookies.remove("userToken");
                router.replace("/authentication/Login");
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
            const res = await axios.post("/api/exercises/answer", { answer: userAnswerValue });
            setShowResult(true);

            const correct = res.data.isCorrect;
            const correctAnswer = res.data.correctAnswer || question.correctAnswer;
            const isFraction = typeof question.first === "string" && question.first.includes("/");
            const correctDisplay = isFraction
                ? `${Math.floor(correctAnswer / 1000)}/${correctAnswer % 1000}`
                : correctAnswer;

            if (correct) {
                setResponseMessage(`תשובה נכונה! רמה נוכחית: ${res.data.currentLevel}`);
                if (res.data.levelUpMessage) {
                    setResponseMessage(`תשובה נכונה! ${res.data.levelUpMessage}`);
                    setShowLevelUpModal(true);
                    setShowConfetti(true);

                }
            } else {
                setResponseMessage(`תשובה שגויה! התשובה הנכונה היא ${correctDisplay}`);
                Vibration.vibrate(200);
            }

            setHistory((prev) => [
                ...prev,
                {
                    question: `${question.first} ${convertSign(question.operationSign)} ${question.second}`,
                    userAnswer: question.answers[selectedAnswer],
                    correct,
                },
            ]);
        } catch (err) {
            setResponseMessage("שגיאה, נסה שוב.");
        }
    }

    function handleNextQuestion() {
        if (!showResult) {
            alert("בדוק את התשובה לפני מעבר");
            return;
        }
        if (id) fetchNextQuestion(id);
    }

    function convertSign(sign) {
        switch (sign) {
            case "fracAdd": case "frac+": case "add": case "+": return "+";
            case "fracSub": case "frac-": case "sub": case "-": return "-";
            case "fracMul": case "frac*": case "mul": case "*": return "×";
            case "fracDiv": case "frac/": case "div": case "/": return "÷";
            default: return sign;
        }
    }

    function renderBedidesExplanation() {
        const operationWord = id == 1 ? "נוסיף" : "נחסיר";
        return (
            <Animated.View style={[styles.explanation, { opacity: fadeAnim }]}>
                <Text style={styles.explanationText}>נניח שיש לנו {question.first} כדורים, {operationWord} {question.second}</Text>
                <BedidesVisualization
                    firstNum={Number(question.first)}
                    secondNum={Number(question.second)}
                    operation={id == 1 ? "add" : "sub"}
                />
                <Text style={styles.explanationText}>ונקבל {eval(`${question.first}${convertSign(question.operationSign)}${question.second}`)} כדורים.</Text>
            </Animated.View>
        );
    }

    function renderVerticalSolution() {
        const sign = convertSign(question.operationSign);
        const first = Number(question.first);
        const second = Number(question.second);
        const result = eval(`${first}${sign}${second}`);
        return (
            <Animated.View style={[styles.explanation, { opacity: fadeAnim }]}>
                <Text style={styles.explanationText}>פתרון במאונך:</Text>
                <Text style={[styles.explanationText, { textAlign: 'right', marginTop: 10 }]}>  {`
    ${first}
${sign}   ${second}
---------
    ${result}`}</Text>
            </Animated.View>
        );
    }

    if (!id || !question) return <Text style={styles.loading}>טוען...</Text>;

    const isFraction = typeof question.first === "string" && question.first.includes("/");
    const displayAnswers = isFraction
        ? question.answers.map((encoded) => `${Math.floor(encoded / 1000)}/${encoded % 1000}`)
        : question.answers;

    const isAddOrSub = id == 1 || id == 2;
    const isBedides = myTopicLevel <= 2;

    function generateQuestionText(first, second, sign, topicLevel) {
        const op = convertSign(sign);

        const names = ["נועה", "מיטל", "תמר", "הדס", "נעמה"];
        const items = ["תפוחים", "בננות", "עפרונות", "כדורים", "ספרים", "צעצועים"];
        const name = names[Math.floor(Math.random() * names.length)];
        const item = items[Math.floor(Math.random() * items.length)];

        // ניסוחים מילוליים לפי פעולה
        const verbalTemplates = {
            '+': [
                `${name} קיבלה ${first} ${item}, ואז הוסיפו לה עוד ${second}. כמה ${item} יש לה עכשיו?`,
                `${name} אספה ${first} ${item} ועוד ${second}. כמה יש לה בסך הכל?`,
                `${name} קיבלה ${first} ${item} ונתנה לחבר ${second}. כמה ${item} נשארו לה?`,
                `${name} קיבלה ${first} ${item}, ועכשיו הוסיפו לה ${second} נוספים. כמה יש לה?`
            ],
            '-': [
                `${name} קיבלה ${first} ${item}, אבל איבדה ${second}. כמה ${item} נשארו לה?`,
                `${name} התחילה עם ${first} ${item} ונתנה לחבר ${second}. כמה נשארו לה?`,
                `${name} קיבלה ${first} ${item}, אך איבדה ${second}. כמה ${item} נשארו לה?`,
                `${name} התחילה עם ${first} ${item} ונתנה ${second} לאחרים. כמה נשארו לה?`,
                // נוסחים נוספים לחיסור
                `${first} ${op} ${second} שווה ל...?`,
                `מה התוצאה של ${first} ${op} ${second}?`,
            ],
            '×': [
                `${name} קיבלה ${first} שקיות עם ${second} ${item} בכל אחת. כמה ${item} יש לה בסך הכל?`,
                `${name} ארזה ${first} קופסאות, ובכל קופסה יש ${second} ${item}. כמה פריטים יש לה?`,
                `${name} קיבלה ${first} ${item}, והם היו בכל ${second} תיקים. כמה ${item} יש לה בסך הכל?`
            ],
            '÷': [
                `${name} חילקה ${first} ${item} שווה בשווה ל-${second} ילדים. כמה קיבל כל ילד?`,
                `${first} ${item} חולקו ל-${second} קבוצות שוות. כמה יש בכל קבוצה?`,
                `${first} ${item} חולקו באופן שווה בין ${second} ילדים. כמה קיבל כל אחד?`,
                // נוסחים נוספים לחלוקה
                `${first} ${item} חולקו בין ${second} ילדים. כמה קיבל כל אחד?`,
                `כמה ${item} יש לכל ילד אם חילקו ${first} ${item} ל-${second} ילדים?`
            ],
        };

        // נוסחים כלליים / מתמטיים קלאסיים - הגיוון ייעשה כאן לפי סוג הפעולה
        // ניסוחים כלליים / מתמטיים קלאסיים
        const genericTemplates = [
            `כמה זה ${second} ${op} ${first}?`,
            `${second} ${op} ${first} שווה ל...?`,
            `בוא נחשב: ${second} ${op} ${first}`,
            `מה התוצאה של ${second} ${op} ${first}?`,
        ];

        // // לרמות נמוכות – להשתמש בניסוח פשוט
        // if (topicLevel <= 2) {
        //     return `${second} ${op} ${first} שווה ל...?`;
        // }

        // רמות בינוניות – אפשר לגוון
        const allOptions = [
            ...(verbalTemplates[sign] || []),
            ...(genericTemplates[sign] || [])
        ];

        // בחר נוסח רנדומלי מתוך האפשרויות
        return allOptions[Math.floor(Math.random() * allOptions.length)];
    }
        return (
        <ProtectedRoute requireAuth={true}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {isFraction && (question.first.includes('/') || question.second.includes('/')) ? (
                            <>
                                {question.first.includes('/') ? (
                                    <Fraction numerator={question.first.split('/')[0]} denominator={question.first.split('/')[1]} />
                                ) : (
                                    <Text style={styles.title}>{question.first}</Text>
                                )}

                                <Text style={{ fontSize: 20, marginHorizontal: 8 }}>{convertSign(question.operationSign)}</Text>

                                {question.second.includes('/') ? (
                                    <Fraction numerator={question.second.split('/')[0]} denominator={question.second.split('/')[1]} />
                                ) : (
                                    <Text style={styles.title}>{question.second}</Text>
                                )}

                                <Text style={{ fontSize: 20, marginLeft: 8 }}>= ?</Text>
                            </>
                        ) : (
                            <Text style={styles.title}>
                                {question.text}
                            </Text>
                        )}
                    </View>
                </View>

                {displayAnswers.map((ans, idx) => {
                    const isAnsFraction = typeof ans === 'string' && ans.includes('/');
                    const [num, den] = isAnsFraction ? ans.split('/') : [];

                    return (
                        <Pressable
                            key={idx}
                            style={[styles.answerButton, selectedAnswer === idx && styles.selectedAnswer]}
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

                <Pressable onPress={handleCheckAnswer} style={styles.checkButton}>
                    <Text style={styles.primaryText}>בדיקה</Text>
                </Pressable>

                {responseMessage !== '' && <Text style={styles.feedback}>{responseMessage}</Text>}

                <Pressable onPress={handleNextQuestion} style={styles.secondaryButton}>
                    <Text style={styles.secondaryText}>שאלה הבאה</Text>
                </Pressable>

                {isAddOrSub && (
                    <Pressable onPress={() => setShowSolution(!showSolution)} style={styles.helpButton} disabled={!showResult}>
                        <Text style={{ color: !showResult ? 'gray' : 'blue' }}>{showSolution ? 'הסתר פתרון' : 'איך פותרים?'}</Text>
                    </Pressable>
                )}

                {showSolution && showResult && (
                    isBedides ? renderBedidesExplanation() : renderVerticalSolution()
                )}

                {showConfetti && (
                    <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} fadeOut={true} />
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

                <View style={{ marginTop: 30 }}>
                    <Text style={styles.sectionTitle}>היסטוריית תשובות:</Text>
                    {history.map((item, i) => (
                        <Text key={i} style={{ color: item.correct ? 'green' : 'red' }}>
                            {item.question} | ענית: {item.userAnswer} {item.correct ? '✓' : '✗'}
                        </Text>
                    ))}
                </View>

                <Pressable onPress={() => router.push('/MyCourses')} style={[styles.finishButton, { marginTop: 40 }]}>
                    <Text style={styles.primaryText}>סיום תרגול</Text>
                </Pressable>
            </ScrollView>
        </ProtectedRoute>
    );
}

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
        backgroundColor: "#E5E7EB",
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
    closeButtonText: { color: "white", fontWeight: "bold" },
    sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
    loading: { textAlign: 'center', marginTop: 40, fontSize: 18 },
});
