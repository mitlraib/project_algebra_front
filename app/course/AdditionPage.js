import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import styles from '../../styles/styles';

export default function AdditionPage() {
    const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    function getRandomNumber() {
        return Math.floor(Math.random() * 10) + 1;
    }

    function generateQuestion() {
        const first = getRandomNumber();
        const second = getRandomNumber();
        const correctAnswer = first + second;
        const answers = [correctAnswer, correctAnswer + 1, correctAnswer - 1, correctAnswer + 5].sort(() => Math.random() - 0.5);
        return { first, second, correctAnswer, answers };
    }

    const handleSelect = (ans, idx) => {
        if (!showResult) {
            setSelectedAnswer(idx);
        }
    };

    const handleCheck = () => {
        if (selectedAnswer !== null) {
            setShowResult(true);
        }
    };

    const handleNextQuestion = () => {
        if (showResult && selectedAnswer !== null) {
            setCurrentQuestion(generateQuestion());
            setSelectedAnswer(null);
            setShowResult(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={localStyles.title}>חיבור</Text>
            <Text style={localStyles.question}>
                כמה זה {currentQuestion.first} + {currentQuestion.second}?
            </Text>

            {currentQuestion.answers.map((ans, idx) => {
                let resultMark = '';
                if (showResult && selectedAnswer === idx) {
                    resultMark = ans === currentQuestion.correctAnswer ? '✔' : '✘';
                }
                return (
                    <Pressable
                        key={idx}
                        onPress={() => handleSelect(ans, idx)}
                        disabled={showResult}
                        style={[
                            localStyles.answerButton,
                            selectedAnswer === idx && localStyles.selectedAnswer
                        ]}
                    >
                        <Text style={localStyles.answerText}>
                            {ans} {resultMark}
                        </Text>
                    </Pressable>
                );
            })}

            <Pressable onPress={handleCheck} style={localStyles.checkButton} disabled={showResult || selectedAnswer === null}>
                <Text style={localStyles.checkButtonText}>בדיקה</Text>
            </Pressable>

            {showResult && (
                <View style={{ marginTop: 20 }}>
                    {currentQuestion.answers[selectedAnswer] === currentQuestion.correctAnswer ? (
                        <Text style={{ color: 'green', fontSize: 18 }}>נכון מאוד!</Text>
                    ) : (
                        <Text style={{ color: 'red', fontSize: 18 }}>טעות! לא נורא... נמשיך לשאלה הבאה!</Text>
                    )}
                </View>
            )}

            <Pressable onPress={handleNextQuestion} style={[localStyles.nextButton, (!showResult || selectedAnswer === null) && localStyles.disabledButton]} disabled={!showResult || selectedAnswer === null}>
                <Text style={localStyles.nextButtonText}>שאלה הבאה</Text>
            </Pressable>
        </View>
    );
}

const localStyles = StyleSheet.create({
    title: {
        fontSize: 22,
        marginBottom: 10,
        textAlign: 'center'
    },
    question: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center'
    },
    answerButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 5,
        borderRadius: 5,
        padding: 12,
        alignItems: 'center'
    },
    answerText: {
        fontSize: 18
    },
    selectedAnswer: {
        backgroundColor: '#e0f7fa'
    },
    checkButton: {
        marginTop: 10,
        backgroundColor: 'blue',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center'
    },
    checkButtonText: {
        color: 'white',
        fontSize: 18
    },
    nextButton: {
        marginTop: 10,
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center'
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18
    },
    disabledButton: {
        backgroundColor: 'gray'
    }
});
