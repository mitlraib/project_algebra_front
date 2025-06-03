import React, { useState, useEffect, useRef } from "react";
import {View, Text, Pressable, ScrollView, Modal, Animated, Vibration,} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ConfettiCannon from "react-native-confetti-cannon";
import { LinearGradient } from 'expo-linear-gradient';
import ProtectedRoute from "../../components/ProtectedRoute";
import SolutionVisualization from "../../components/SolutionVisualization";
import  storage  from '../utils/storage';
import { Colors } from '../../constants/Colors';
import {exercisePageStyles} from '../../styles/styles'
import  api  from  '../../src/api/axiosConfig';


function formatFraction(numerator, denominator) {
    if (numerator === 0) return "0";
    if (numerator === denominator) return "1";
    return `${numerator}/${denominator}`}

function Fraction({ numerator, denominator }) {
    return (
        <View style={{ alignItems: 'center', marginHorizontal: 4 }}>
            <Text style={{ fontSize: 20 }}>{numerator}</Text>
            <View style={{ height: 1, backgroundColor: 'black', width: 30, marginVertical: 2 }} />
            <Text style={{ fontSize: 20 }}>{denominator}</Text>
        </View>
    );
}

// זה לשאלה בלבד
function FractionInQuestionTitle({ numerator, denominator }) {
    return (
        <View style={{ alignItems: 'center', marginHorizontal: 4 }}>
            <Text style={exercisePageStyles.title}>{numerator}</Text>
            <View style={{ height: 1, backgroundColor: 'white', width: 30, marginVertical: 2 }} />
            <Text style={exercisePageStyles.title}>{denominator}</Text>
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
    const [answerFeedbackColor, setAnswerFeedbackColor] = useState(null);
    const [isCheckDisabled, setIsCheckDisabled] = useState(false);
    const [detailedSolutions, setDetailedSolutions] = useState(true);



    useEffect(() => {
        if (!id) return;

        if (id === 'random') {
            fetchRandomQuestion();
        } else {
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
            const res = await api.get("/api/user/topics-levels");   // עכשיו ילך לבק-אנד בענן

            if (res.data.success) {
                const found = res.data.topics.find((t) => t.topicId == topicId);
                if (found) setMyTopicLevel(found.level);
            }
        } catch (err) {
            console.log("Error fetchTopicLevel:", err);
        }
    }

    async function fetchNextQuestion(topicId) {
        console.time("⏱️ fetchNextQuestion");
        try {
            console.log("📤 שולחת בקשה לשרת עם topicId =", topicId);
            const res = await api.get(`/api/exercises/next?topicId=${topicId}`);
            console.log("📥 קיבלתי תשובה:", res.data);
            console.timeEnd("⏱️ fetchNextQuestion");

            const questionData = res.data;
            setIsCheckDisabled(false); // מאפשר לחיצה על כפתור בדיקה

            questionData.text = generateQuestionText(
                questionData.first,
                questionData.second,
                questionData.operationSign,
                myTopicLevel
            );

            setQuestion(questionData);
            setSelectedAnswer(null);
            setShowResult(false);
            setResponseMessage("");
            setShowLevelUpModal(false);
            setShowConfetti(false);
            setShowSolution(false);
            setAnswerFeedbackColor(null);

        } catch (err) {
            console.timeEnd("⏱️ fetchNextQuestion");
            console.error("❌ שגיאה ב־fetchNextQuestion:", err);

            // טיפול במשתמש לא מחובר
            if (err.response?.status === 401) {
                await storage.remove("userToken");
                router.replace("/authentication/Login");
            } else {
                alert("שגיאה בשרת בעת טעינת שאלה");
            }
        }
    }

    async function fetchRandomQuestion() {
        try {
            const res = await api.get(`/api/exercises/next-random`);

            const questionData = res.data;

            setIsCheckDisabled(false);

            // תמיד תשתמשי במחולל השאלות שלך:
            if (!questionData.text) {
                questionData.text = generateQuestionText(
                    questionData.first,
                    questionData.second,
                    questionData.operationSign,
                    myTopicLevel
                );
            }

            setQuestion(questionData);
            setSelectedAnswer(null);
            setShowResult(false);
            setResponseMessage('');
            setShowLevelUpModal(false);
            setShowConfetti(false);
            setShowSolution(false);
            setAnswerFeedbackColor(null);
        } catch (err) {
            if (err.response?.status === 401) {
                await storage.remove('userToken');
                router.replace('/authentication/Login');

            } else {
                console.log("Error fetching random question:", err);
            }
        }
    }

    useEffect(() => {
        api.get("/api/user")

    .then(r => {setDetailedSolutions(
                r.data.hasOwnProperty("detailedSolutions") ? r.data.detailedSolutions   // ערך מהשרת
                    : true );
            });
    }, []);



    async function handleCheckAnswer() {
        if (selectedAnswer === null) {
            alert("יש לבחור תשובה תחילה.");
            return;
        }
        if (isCheckDisabled) {
            return; // לא נאפשר בדיקה חוזרת
        }
        setIsCheckDisabled(true); // מונע לחיצה חוזרת


        try {
            const userAnswerValue = question.answers[selectedAnswer];
            const res = await api.post("/api/exercises/answer", {
                answer: userAnswerValue,
                question: question
            });


            setShowResult(true);

            const correct = res.data.isCorrect;
            const correctAnswer = res.data.correctAnswer || question.correctAnswer;
            const isFraction = typeof question.first === "string" && question.first.includes("/");
            const correctDisplay = isFraction
                ? `${Math.floor(correctAnswer / 1000)}/${correctAnswer % 1000}`
                : correctAnswer;

            if (correct) {
                setAnswerFeedbackColor("green");
                setResponseMessage(`תשובה נכונה! רמה נוכחית: ${res.data.currentLevel}`);
                if (res.data.levelUpMessage) {
                    setResponseMessage(`תשובה נכונה! ${res.data.levelUpMessage}`);
                    setShowLevelUpModal(true);
                    setShowConfetti(true);
                }
            } else {
                setAnswerFeedbackColor("red");
                Vibration.vibrate(200);
                setResponseMessage(`תשובה שגויה! התשובה הנכונה היא ${correctDisplay}`);
            }


            setHistory((prev) => [
                ...prev,
                {
                    question: `${question.first} ${convertSign(question.operationSign)} ${question.second}`,
                    userAnswer: decodeFraction(question.answers[selectedAnswer]), // שימוש בפונקציית decodeFraction להצגה נכונה
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
        if (id === 'random') {
            fetchRandomQuestion();
        } else {
            fetchNextQuestion(id);
        }    }

    function convertSign(sign) {
        switch (sign) {
            case "fracAdd": case "frac+": case "add": case "+": return "+";
            case "fracSub": case "frac-": case "sub": case "-": return "-";
            case "fracMul": case "frac*": case "mul": case "*": return "×";
            case "fracDiv": case "frac/": case "div": case "/": return "÷";
            default: return sign;
        }
    }

    function renderVisualExplanation() {
        // אם זה כפל (id==3)
        if (id == 3) {
            let first = Number(question.first);    // מספר ראשון
            let second = Number(question.second);  // מספר שני

            if (second < first) {
                const tmp = first;
                first = second;
                second = tmp;
            }

            const result = first * second;

            if (result < 20) {
                return (
                    <Animated.View style={[exercisePageStyles.explanation, { opacity: fadeAnim }]}>
                        <Text style={exercisePageStyles.explanationText}>
                            נניח שיש לנו {second} קבוצות, בכל קבוצה {first} כדורים
                        </Text>
                        <SolutionVisualization
                            firstNum={first}
                            secondNum={second}
                            operation="mul"
                        />
                        <Text style={exercisePageStyles.explanationText}>
                            סה"כ {result} כדורים.
                        </Text>
                    </Animated.View>
                );
            }
            console.log({detailedSolutions, id, isAddOrSubOrSmallMulOrDiv, },"הייי");
            // אם התוצאה >= 20, אפשר להראות פתרון אחר (טור אנכי וכו') או לא להראות בכלל
            return (
                <Animated.View style={[exercisePageStyles.explanation, { opacity: fadeAnim }]}>
                    <Text style={exercisePageStyles.explanationText}>
                        התוצאה גדולה מדי להצגת עיגולים (לפחות 20).
                    </Text>
                </Animated.View>
            );
        }

        // אם זה חילוק (id==4)
        if (id == 4) {
            const dividend = Number(question.first);   // המספר שמחלקים
            const divisor = Number(question.second);   // למי מחלקים

            const quotient = dividend / divisor;

            if (dividend <= 20 && divisor > 0 && Number.isInteger(quotient)) {
                return (
                    <Animated.View style={[exercisePageStyles.explanation, { opacity: fadeAnim }]}>
                        <Text style={exercisePageStyles.explanationText}>
                            נניח שיש לנו {dividend} כדורים, אנחנו רוצים לחלק אותם בין {divisor} ילדים
                        </Text>
                        <SolutionVisualization
                            firstNum={dividend}
                            secondNum={divisor}
                            operation="div"
                        />
                        <Text style={exercisePageStyles.explanationText}>
                            כל אחד יקבל {quotient} כדורים.
                        </Text>
                    </Animated.View>
                );
            }

            return (
                <Animated.View style={[exercisePageStyles.explanation, { opacity: fadeAnim }]}>
                    <Text style={exercisePageStyles.explanationText}>
                        לא ניתן להמחיש את החילוק בעיגולים (או שהוא לא שלם / גדול מדי).
                    </Text>
                </Animated.View>
            );
        }


        // אחרת זה חיבור/חיסור
        const operationWord = id == 1 ? "נוסיף" : "נחסיר";
        return (
            <Animated.View style={[exercisePageStyles.explanation, { opacity: fadeAnim }]}>
                <Text style={exercisePageStyles.explanationText}>
                    נניח שיש לנו {question.first} כדורים, {operationWord} {question.second}
                </Text>
                <SolutionVisualization
                    firstNum={Number(question.first)}
                    secondNum={Number(question.second)}
                    operation={id == 1 ? "add" : "sub"}
                />
                <Text style={exercisePageStyles.explanationText}>
                    ונקבל {eval(`${question.first}${convertSign(question.operationSign)}${question.second}`)} כדורים.
                </Text>
            </Animated.View>
        );
    }

    function renderVerticalSolution() {
        const sign = convertSign(question.operationSign);
        const first = Number(question.first);
        const second = Number(question.second);
        const result = eval(`${first}${sign}${second}`);
        return (
            <Animated.View style={[exercisePageStyles.explanation, { opacity: fadeAnim }]}>
                <Text style={exercisePageStyles.explanationText}>פתרון במאונך:</Text>
                <Text style={[exercisePageStyles.explanationText, { textAlign: 'right', marginTop: 10 }]}>  {`
    ${first}
${sign}   ${second}
---------
    ${result}`}</Text>
            </Animated.View>
        );
    }

    if (!id || !question) return <Text style={exercisePageStyles.loading}>טוען...</Text>;

    const isFraction = typeof question.first === "string" && question.first.includes("/");
    const displayAnswers = isFraction
        ? question.answers.map((encoded) => `${Math.floor(encoded / 1000)}/${encoded % 1000}`)
        : question.answers;


    // המרת first ו-second למספרים (כדי שנוכל לבדוק תוצאה בכפל)
    const firstNum = Number(question.first);
    const secondNum = Number(question.second);

// חישוב תוצאת הכפל (אם זה באמת כפל)
    const multiplyResult = firstNum * secondNum;

// נגדיר תנאי מורחב: הצג כפתור אם זה חיבור/חיסור (id=1/2) או אם זה כפל (id=3) עם תוצאה קטנה מ-20
    const isAddOrSubOrSmallMulOrDiv =
        (id == 1 || id == 2) // חיבור או חיסור
        || (id == 3 && multiplyResult < 20) // כפל קטן
        || (id == 4 && firstNum <= 20 && secondNum > 0 && Number.isInteger(firstNum / secondNum)); // חילוק פשוט


    const isVisual = myTopicLevel <= 2;

    function decodeFraction(encoded) {
        if (encoded < 1000) return encoded.toString(); // אם זה מספר רגיל, לא שבר
        const num = Math.floor(encoded / 1000);
        const den = encoded % 1000;
        if (den === 0) return '∞';
        if (num % den === 0) return `${num / den}`;
        return `${num}/${den}`;
    }



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
                `${name} קיבלה ${first} ${item} ואז קיבלה מחבר עוד ${second}. כמה ${item} יש לה עכשיו?`,
                `${name} קיבלה ${first} ${item}, ועכשיו הוסיפו לה ${second} נוספים. כמה יש לה?`
            ],
            '-': [
                `${name} קיבלה ${first} ${item}, אבל איבדה ${second}. כמה ${item} נשארו לה?`,
                `${name} התחילה עם ${first} ${item} ונתנה לחבר ${second}. כמה נשארו לה?`,
                `${name} קיבלה ${first} ${item}, אך איבדה ${second}. כמה ${item} נשארו לה?`,
                `${name} התחילה עם ${first} ${item} ונתנה ${second} לאחרים. כמה נשארו לה?`,
            ],
            '×': [
                `${name} קיבלה ${second} שקיות, ובכל שקית יש ${first} ${item}. כמה ${item} יש לה בסך הכל?`,
                `${name} ארזה ${second} קופסאות, ובכל קופסה יש ${first} ${item}. כמה ${item} יש לה בסך הכל?`,
                `ל${name} יש ${second} תיקים, ובכל תיק ${first} ${item}. כמה ${item} יש לה בסך הכל?`,
                `${name} הכינה ${second} מגשים, ובכל מגש ${first} ${item}. כמה ${item} יש לה בסך הכל?`,
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



        // רמות בינוניות – אפשר לגוון
        const allOptions = [
            ...(verbalTemplates[sign] || []),
            ...genericTemplates
        ];

        // בחר נוסח רנדומלי מתוך האפשרויות
        return allOptions[Math.floor(Math.random() * allOptions.length)];
    }


    return (
        <ProtectedRoute requireAuth={true}>
            <ScrollView contentContainerStyle={exercisePageStyles.container}
                        style={{ backgroundColor: Colors.background }}>
                <LinearGradient
                    colors={[Colors.primary, Colors.accent]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={exercisePageStyles.gradientQuestionBox}
                >
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {isFraction && (question.first.includes('/') || question.second.includes('/')) ? (
                                <>
                                    {question.first.includes('/') ? (
                                        <FractionInQuestionTitle numerator={question.first.split('/')[0]} denominator={question.first.split('/')[1]} />
                                    ) : (
                                        <Text style={exercisePageStyles.title}>{question.first}</Text>
                                    )}

                                    <Text style={exercisePageStyles.title}>{convertSign(question.operationSign)}</Text>

                                    {question.second.includes('/') ? (
                                        <FractionInQuestionTitle numerator={question.second.split('/')[0]} denominator={question.second.split('/')[1]} />
                                    ) : (
                                        <Text style={exercisePageStyles.title}>{question.second}</Text>
                                    )}

                                    <Text style={exercisePageStyles.title}>= ?</Text>
                                </>
                            ) : (
                                <Text style={exercisePageStyles.title}>
                                    {question.text}
                                </Text>
                            )}
                        </View>
                    </View>
                </LinearGradient>

                {displayAnswers.map((ans, idx) => {
                    const isAnsFraction = typeof ans === 'string' && ans.includes('/');
                    const [num, den] = isAnsFraction ? ans.split('/') : [];

                    const isSelected = selectedAnswer === idx;
                    const isCorrectAnswer = question.answers[idx] === question.correctAnswer;

                    let answerStyle = exercisePageStyles.answerButton;

                    if (showResult) {
                        if (isSelected) {
                            answerStyle = isCorrectAnswer ? exercisePageStyles.correctAnswer : exercisePageStyles.incorrectAnswer;
                        } else if (isCorrectAnswer) {
                            answerStyle = exercisePageStyles.correctAnswer;
                        }
                    } else if (isSelected) {
                        answerStyle = exercisePageStyles.selectedAnswer;
                    }

                    return (
                        <Pressable
                            key={idx}
                            style={[answerStyle]}
                            onPress={() => !showResult && setSelectedAnswer(idx)}
                            disabled={showResult}
                        >
                            <View style={{ alignItems: 'center' }}>
                                {isAnsFraction ? (
                                    (formatFraction(Number(num), Number(den)) === "1" || formatFraction(Number(num), Number(den)) === "0") ? (
                                        <Text style={exercisePageStyles.answerText}>{formatFraction(Number(num), Number(den))}</Text>
                                    ) : (
                                        <Fraction numerator={num} denominator={den} />
                                    )

                                ) : (
                                    <Text style={exercisePageStyles.answerText}>{ans}</Text>
                                )}
                            </View>
                        </Pressable>
                    );
                })}

                <Pressable
                    onPress={handleCheckAnswer}
                    style={[exercisePageStyles.checkButton, isCheckDisabled && { opacity: 0.5 }]}
                    disabled={isCheckDisabled}
                >
                    <Text style={exercisePageStyles.primaryText}>בדיקה</Text>
                </Pressable>


                {responseMessage !== '' && <Text style={exercisePageStyles.feedback}>{responseMessage}</Text>}

                <Pressable onPress={handleNextQuestion} style={[exercisePageStyles.nextButton, !showResult && { opacity: 0.5 }]}>
                    <Text style={exercisePageStyles.nextButtonText}>שאלה הבאה</Text>
                </Pressable>


                { detailedSolutions &&isAddOrSubOrSmallMulOrDiv && (
                    <Pressable onPress={() => setShowSolution(!showSolution)} style={exercisePageStyles.helpButton} disabled={!showResult}>
                        <Text style={{
                            color: !showResult ? 'gray' : '#A47DAB',
                            fontWeight: showResult ? 'bold' : 'normal',
                            fontSize: 18,
                            textDecorationLine: showResult ? 'underline' : 'none'
                        }}>
                            {showSolution ? 'הסתר פתרון' : 'איך פותרים?'}
                        </Text>
                    </Pressable>
                )}


                {showSolution && showResult && (
                    isVisual ? renderVisualExplanation() : renderVerticalSolution()
                )}

                {showConfetti && (
                    <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} fadeOut={true} />
                )}

                <Modal visible={showLevelUpModal} transparent animationType="slide">
                    <View style={exercisePageStyles.modalOverlay}>
                        <View style={exercisePageStyles.modalBox}>
                            <Text style={exercisePageStyles.modalTitle}>כל הכבוד!</Text>
                            <Text style={exercisePageStyles.modalText}>עלית רמה!</Text>
                            <Pressable onPress={() => setShowLevelUpModal(false)} style={exercisePageStyles.closeButton}>
                                <Text style={exercisePageStyles.closeButtonText}>סגור</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <View style={{ marginTop: 30, alignItems: 'center' }}>
                    <Text style={exercisePageStyles.sectionTitle}>היסטוריית תשובות:</Text>
                    {history.map((item, i) => (
                        <Text key={i} style={{ color: item.correct ? 'green' : 'red', textAlign: 'center', writingDirection: 'rtl' }}>
                            {item.question.split('').reverse().join('')} | ענית: {item.userAnswer} {item.correct ? '✓' : '✗'}
                        </Text>

                    ))}
                </View>


                <Pressable
                    onPress={() => {
                        if (id === 'random') {
                            router.push('/Dashboard');
                        } else {
                            router.push('/MyCourses');
                        }
                    }}
                    style={[exercisePageStyles.finishButton, { marginTop: 40 }]}
                >
                    <Text style={exercisePageStyles.primaryText}>סיום תרגול</Text>
                </Pressable>

            </ScrollView>
        </ProtectedRoute>
    );
}


