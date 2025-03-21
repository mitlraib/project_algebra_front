import React from 'react';
import { View, Text } from 'react-native';

export default function BedidesVisualization({ firstNum, secondNum, operation }) {
    let resultNum = 0;
    if (operation === 'add') {
        resultNum = firstNum + secondNum;
    } else {
        resultNum = firstNum - secondNum;
    }

    const renderRow = (count, color) => {
        return (
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                {[...Array(count)].map((_, i) => (
                    <View key={i} style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: color,
                        marginRight: 5
                    }} />
                ))}
            </View>
        );
    };

    return (
        <View style={{ marginTop: 10 }}>
            <Text>המחשה לביצוע {operation === 'add' ? 'חיבור' : 'חיסור'}:</Text>
            {renderRow(firstNum, '#FF6666')}
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
                {operation === 'add' ? '+' : '-'}
            </Text>
            {renderRow(secondNum, '#66CCFF')}
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>=</Text>
            {renderRow(Math.max(0, resultNum), '#66FF66')}
        </View>
    );
}
