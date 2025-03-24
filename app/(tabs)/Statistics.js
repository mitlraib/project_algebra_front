import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../styles/styles';

export default function Statistics() {
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        fetch("/api/user", { credentials: "include" }) // מביאים את פרטי המשתמש
            .then((res) => res.json())
            .then((data) => {
                if (!data.success || data.role !== "ADMIN") {
                    setShowMessage(true); // מציג הודעה
                    setTimeout(() => {
                        router.replace("/Dashboard"); // לאחר 3 שניות מעביר לדשבורד
                    }, 1000);
                } else {
                    setUserRole(data.role);
                }
            })
            .catch(() => {
                setShowMessage(true);
                setTimeout(() => {
                    router.replace("/Dashboard");
                }, 3000);
            })
            .finally(() => setLoading(false));
    }, []);

    function handleGoBack() {
        router.push("/Dashboard");
    }

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
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
