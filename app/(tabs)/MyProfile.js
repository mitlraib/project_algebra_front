import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

export default function MyProfile() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [level, setLevel] = useState(1);
    const [language, setLanguage] = useState('עברית');
    const [detailedSolutions, setDetailedSolutions] = useState(false);

    useEffect(() => {
        fetchUserFromServer();
    }, []);

    const fetchUserFromServer = async () => {
        try {
            console.log("Fetching user info from /api/user...");
            const response = await axios.get('/api/user');
            // אם זה 401 => ProtectedRoute כבר יטפל? תלוי
            if (response.data.success) {
                setName(`${response.data.firstName} ${response.data.lastName}`);
                setEmail(response.data.mail);
                setLevel(response.data.level || 1);
            }
        } catch (err) {
            console.log("Error fetching user info:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToDashboard = () => {
        router.push('/(tabs)/Dashboard');
    };

    const saveUserDataLocally = () => {
        // אם תרצי לשמור הגדרות מקומיות
    };

    return (
        <ProtectedRoute requireAuth={true}>
            <View style={styles.container}>
                <Pressable onPress={handleGoToDashboard} style={styles.backButton}>
                    <Text style={styles.backButtonText}>⬅ חזרה לדאשבורד</Text>
                </Pressable>

                <Text style={styles.title}>פרופיל המשתמש</Text>

                {isLoading ? (
                    <Text style={styles.loadingText}>טוען נתוני משתמש...</Text>
                ) : (
                    <>
                        <Text style={styles.label}>שלום {name || 'משתמש'}!</Text>
                        <Text style={styles.label}>אימייל: {email}</Text>

                        <Text style={styles.label}>רמת משתמש: {level}</Text>

                        <Text style={styles.label}>שפת ממשק:</Text>
                        <TextInput
                            style={styles.input}
                            value={language}
                            onChangeText={setLanguage}
                        />

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>הצגת פתרונות מודרכים:</Text>
                            <Switch
                                value={detailedSolutions}
                                onValueChange={setDetailedSolutions}
                            />
                        </View>

                        <Pressable onPress={saveUserDataLocally} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>שמור שינויים</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10
    },
    label: {
        fontSize: 18,
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15
    },
    switchContainer: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 15
    },
    saveButton: {
        backgroundColor: 'blue',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center'
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16
    },
    loadingText: {
        fontSize: 16,
        color: 'gray',
        marginTop: 20
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 10,
        backgroundColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        zIndex: 10
    },

    backButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    }
});
