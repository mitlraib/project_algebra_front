//BedidesVisualization

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function BedidesVisualization({ firstNum, secondNum, operation }) {
    let resultNum = 0;
    if (operation === 'add') {
        resultNum = firstNum + secondNum;
    } else {
        resultNum = firstNum - secondNum;
    }

    const renderRow = (count, color) => {
        return (
            <View style={{ flexDirection: 'row-reverse', marginBottom: 5 }}>
                {/* row-reverse כדי להתחיל מימין */}
                {[...Array(count)].map((_, i) => (
                    <View key={i} style={{
                        width: 25,
                        height: 25,
                        borderRadius: 12.5,
                        backgroundColor: color,
                        marginLeft: 5 // כי row-reverse
                    }} />
                ))}
            </View>
        );
    };

    return (
        <ScrollView style={{ maxHeight: 250 }}>
            <View style={styles.container}>

                {renderRow(firstNum, '#FF6666')}
                <Text style={[styles.opSign, { alignSelf: 'flex-end' }]}>
                    {operation === 'add' ? '+' : '-'}
                </Text>
                {renderRow(secondNum, '#66CCFF')}
                <Text style={[styles.opSign, { alignSelf: 'flex-end' }]}>
                    =
                </Text>
                {renderRow(Math.max(0, resultNum), '#66FF66')}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-end',
        padding: 10
    },
    title: {
        fontSize: 18,
        marginBottom: 10
    },
    opSign: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 5
    }
});


//end of BedidesVisualization
