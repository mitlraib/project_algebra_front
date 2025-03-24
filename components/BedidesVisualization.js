// BedidesVisualization.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BedidesVisualization({ firstNum, secondNum, operation }) {
    let resultNum = 0;
    if (operation === 'add') {
        resultNum = firstNum + secondNum;
    } else {
        resultNum = firstNum - secondNum;
    }

    const renderRow = (count, color) => {
        return (
            <View style={styles.rowRight}>
                {[...Array(count)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.circle,
                            { backgroundColor: color }
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={{ marginTop: 10 }}>
            <Text style={styles.textRight}>
                המחשה לביצוע {operation === 'add' ? 'חיבור' : 'חיסור'}:
            </Text>

            {renderRow(firstNum, '#FF6666')}
            <Text style={[styles.textRight, { fontSize: 20, fontWeight: 'bold' }]}>
                {operation === 'add' ? '+' : '-'}
            </Text>
            {renderRow(secondNum, '#66CCFF')}
            <Text style={[styles.textRight, { fontSize: 20, fontWeight: 'bold' }]}>=</Text>
            {renderRow(Math.max(0, resultNum), '#66FF66')}
        </View>
    );
}

const styles = StyleSheet.create({
    rowRight: {
        flexDirection: 'row-reverse', // כדי שהמעגלים יופיעו "מימין לשמאל"
        marginBottom: 5,
        justifyContent: 'flex-start', // אפשר לגוון אם רוצים
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: 5, // שימי לב שבמקום marginRight, כי עשינו row-reverse
    },
    textRight: {
        textAlign: 'right',
        marginBottom: 5,
    }
});
