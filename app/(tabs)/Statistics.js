import React, { useState, useCallback } from 'react';
import { Text, View, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import styles from '../../styles/styles';

export default function Statistics() {
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            setShowMessage(false);
            axios.get("/api/user", { withCredentials: true })
                .then((response) => {
                    const data = response.data;
                    console.log("USER DATA:", data);

                    if (!data.success || data.role?.toUpperCase() !== "ADMIN") {
                        setShowMessage(true);
                        setTimeout(() => {
                            router.replace("/Dashboard");
                        }, 1000);
                    } else {
                        setUserRole(data.role);
                    }
                })
                .catch((error) => {
                    console.log("ERROR:", error);
                    setShowMessage(true);
                    setTimeout(() => {
                        router.replace("/Dashboard");
                    }, 3000);
                })
                .finally(() => setLoading(false));
        }, [])
    );

    function handleGoBack() {
        router.push("/Dashboard");
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (showMessage) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorMessage}>⛔ דף זה מיועד למנהלים בלבד</Text>
                <Text style={styles.errorMessage}>מעביר אותך לדף הראשי...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>סטטיסטיקה</Text>
            <Pressable onPress={handleGoBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>🔙 חזרה למסך הראשי</Text>
            </Pressable>
        </View>
    );
}