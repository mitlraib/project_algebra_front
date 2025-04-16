// components/StatCard.tsx
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;  // אפשר להכניס אייקון של react-native-vector-icons וכו'
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <View style={styles.card}>
            {icon && <View style={styles.iconWrapper}>{icon}</View>}
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        backgroundColor: '#F9FAFB', // tailwind bg-gray-100, או "math-stat"
        padding: 16,
        borderRadius: 8,
        minWidth: 80,
    },
    iconWrapper: {
        marginBottom: 8,
    },
    value: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 14,
        color: '#6B7280', // text-gray-500
    },
});

export default StatCard;
