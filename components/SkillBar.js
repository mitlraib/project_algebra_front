// components/SkillBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SkillBarProps {
    level: number;
    label: string;
    maxLevel?: number;
    style?: object;
}

const SkillBar: React.FC<SkillBarProps> = ({
                                               level,
                                               label,
                                               maxLevel = 100,
                                               style,
                                           }) => {
    const percentage = (level / maxLevel) * 100;

    return (
        <View style={[styles.container, style]}>
            {/* כותרת משמאל וסטטוס מימין */}
            <View style={styles.labelRow}>
                <Text style={styles.labelText}>{label}</Text>
                <Text style={styles.labelText}>
                    {level}/{maxLevel}
                </Text>
            </View>
            {/* בר התקדמות */}
            <View style={styles.barBackground}>
                <View style={[styles.barProgress, { width: `${percentage}%` }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    labelText: {
        fontSize: 14,
        color: '#374151', // גוון אפור כהה (tailwind text-gray-700)
    },
    barBackground: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E5E7EB', // tailwind bg-gray-200
        overflow: 'hidden',
    },
    barProgress: {
        height: '100%',
        backgroundColor: '#6366F1', // tailwind bg-indigo-500 (או Math Primary)
    },
});

export default SkillBar;
