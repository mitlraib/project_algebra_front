//SolutionVisualization
// SolutionVisualization.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function SolutionVisualization({ firstNum, secondNum, operation }) {
    /**
     * פונקציה שמציגה שורה של count עיגולים בצבע color
     */
    const renderRow = (count, color) => {
        return (
            <View style={{ flexDirection: 'row-reverse', marginBottom: 5 }}>
                {[...Array(count)].map((_, i) => (
                    <View
                        key={i}
                        style={{
                            width: 25,
                            height: 25,
                            borderRadius: 12.5,
                            backgroundColor: color,
                            marginLeft: 5 // כי row-reverse מזיז אותנו מימין לשמאל
                        }}
                    />
                ))}
            </View>
        );
    };

    let content = null;

    // בדיקה לפי סוג הפעולה
    if (operation === 'add') {
        // חיבור
        const resultNum = firstNum + secondNum;
        content = (
            <>
                {renderRow(firstNum, '#FF6666')}
                <Text style={[styles.opSign, { alignSelf: 'flex-end' }]}>+</Text>
                {renderRow(secondNum, '#66CCFF')}
                <Text style={[styles.opSign, { alignSelf: 'flex-end' }]}>
                    =
                </Text>
                {renderRow(Math.max(0, resultNum), '#66FF66')}
            </>
        );

    } else if (operation === 'sub') {
        // חיסור
        const resultNum = firstNum - secondNum;
        content = (
            <>
                {renderRow(firstNum, '#FF6666')}
                <Text style={[styles.opSign, { alignSelf: 'flex-end' }]}>-</Text>
                {renderRow(secondNum, '#66CCFF')}
                <Text style={[styles.opSign, { alignSelf: 'flex-end' }]}>
                    =
                </Text>
                {renderRow(Math.max(0, resultNum), '#66FF66')}
            </>
        );

    }  else if (operation === 'div') {
    const quotient = firstNum / secondNum;

    if (firstNum <= 20 && secondNum > 0 && Number.isInteger(quotient)) {
        // מחלקים את העיגולים לקבוצות בגודל quotient
        content = (
            <>
                {[...Array(secondNum)].map((_, idx) => (
                    <View key={idx} style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                        {renderRow(quotient, '#FF6666')}
                        {idx < secondNum - 1 && (
                            <Text style={[styles.opSign, { alignSelf: 'flex-end', marginHorizontal: 5 }]}>+</Text>
                        )}
                    </View>
                ))}
                <Text style={[styles.opSign, { alignSelf: 'flex-end' }]}>=</Text>
                {renderRow(firstNum, '#66FF66')}
            </>
        );
    } else {
        content = (
            <Text style={{textAlign: 'right'}}>
                הפתרון אינו זמין (לא ניתן לחלק בצורה שלמה או שהמספרים גדולים מדי).
            </Text>
        );
    }}
else if (operation === 'mul') {
        // כפל
        const resultNum = firstNum * secondNum;

        // מציגים בעיגולים רק אם התוצאה < 20
        if (resultNum < 20) {
            content = (
                <>
                    {/* מציגים secondNum קבוצות של firstNum עיגולים, עם סימן + ביניהן */}
                    {[...Array(secondNum)].map((_, idx) => (
                        <View key={idx} style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                            {renderRow(firstNum, '#FF6666')}
                            {idx < secondNum - 1 && (
                                <Text style={[styles.opSign, { alignSelf: 'flex-end', marginHorizontal: 5 }]}>+</Text>
                            )}
                        </View>
                    ))}
                    <Text style={[styles.opSign, { alignSelf: 'flex-end' }]}>
                        =
                    </Text>
                    {renderRow(resultNum, '#66FF66')}
                </>
            );
        } else {
            // אם התוצאה >= 20, אפשר להחליט מה להציג. הנה דוגמה להודעה קצרה:
            content = (
                <Text style={{ textAlign: 'right' }}>
                    הפתרון בעיגולים אינו זמין כאשר התוצאה גדולה מ-20
                </Text>
            );
        }
    }

    // עוטפים את התוצאה ב-ScrollView כדי לאפשר גלילה אם צריך
    return (
        <ScrollView style={{ maxHeight: 250 }}>
            <View style={styles.container}>
                {content}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-end',
        padding: 10
    },
    opSign: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 5
    }
});


//end of SolutionVisualization
