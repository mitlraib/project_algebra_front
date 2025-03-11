import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function ProfilePage() {
    const router = useRouter();

    // נתוני המשתמש
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [level, setLevel] = useState(1);
    const [language, setLanguage] = useState('עברית');
    const [detailedSolutions, setDetailedSolutions] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // מצב טעינה

    useEffect(() => {
        loadUserData(); // טוען נתוני משתמש מקומית
        fetchUserFromServer(); // מביא נתונים מהשרת
    }, []);

    /**
     * 📡 1️⃣ שליפת נתוני המשתמש מהשרת
     */
    const fetchUserFromServer = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken'); // שליפת הטוקן מהזיכרון
            if (!userToken) {
                console.error("⚠ אין טוקן שמור - המשתמש לא מחובר.");
                return;
            }

            console.log("📡 שולח בקשת GET לשרת עם טוקן...");
            const response = await axios.get('http://localhost:8080/api/user', {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            console.log("🔍 תשובת השרת:", response.data);

            if (response.data.success) {
                setEmail(response.data.email);
                setName(`${response.data.firstName} ${response.data.lastName}`);
            } else {
                console.error("⚠ המשתמש לא נמצא:", response.data.message);
            }
        } catch (error) {
            console.error("⚠ שגיאה בקבלת נתונים מהשרת:", error);
        }
    };


    /**
     * 2️⃣ טעינת נתוני משתמש מקומית מ-AsyncStorage
     */
    const loadUserData = async () => {
        try {
            const storedLevel = await AsyncStorage.getItem('userLevel');
            const storedLanguage = await AsyncStorage.getItem('userLanguage');
            const storedDetailedSolutions = await AsyncStorage.getItem('detailedSolutions');

            if (storedLevel) setLevel(parseInt(storedLevel));
            if (storedLanguage) setLanguage(storedLanguage);
            if (storedDetailedSolutions) setDetailedSolutions(storedDetailedSolutions === 'true');
        } catch (error) {
            console.error("⚠ שגיאה בטעינת נתוני משתמש:", error);
        }
    };

    /**
     * 3️⃣ שמירת נתונים ל-AsyncStorage
     */
    const saveUserData = async () => {
        try {
            await AsyncStorage.setItem('userLevel', level.toString());
            await AsyncStorage.setItem('userLanguage', language);
            await AsyncStorage.setItem('detailedSolutions', detailedSolutions.toString());

            alert('✅ הנתונים נשמרו בהצלחה!');
        } catch (error) {
            console.error("⚠ שגיאה בשמירת נתוני משתמש:", error);
        }
    };

    /**
     * 4️⃣ מעבר לדאשבורד
     */
    const handleGoToDashboard = () => {
        console.log("🔄 מעבר לדאשבורד...");
        router.push('/(tabs)/Dashboard');
    };

    return (
        <View style={styles.container}>
            {/* 🔙 כפתור חזרה לדאשבורד */}
            <Pressable onPress={handleGoToDashboard} style={styles.backButton}>
                <Text style={styles.backButtonText}>⬅ חזרה לדאשבורד</Text>
            </Pressable>

            <Text style={styles.title}>פרופיל המשתמש</Text>

            {/* אם הנתונים עדיין נטענים */}
            {isLoading ? (
                <Text style={styles.loadingText}>🔄 טוען נתוני משתמש...</Text>
            ) : (
                <>
                    {/* 🖐️ ברכת שלום */}
                    <Text style={styles.welcomeText}>שלום {name || "משתמש"}!</Text>

                    {/* 📨 הצגת האימייל (ללא אפשרות עריכה) */}
                    <Text style={styles.label}>אימייל:</Text>
                    <Text style={styles.staticText}>{email || "לא נמצא"}</Text>

                    {/* 🎮 רמת משתמש */}
                    <Text style={styles.label}>רמת משתמש:</Text>
                    <TextInput
                        style={styles.input}
                        value={level.toString()}
                        onChangeText={(text) => setLevel(text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                    />

                    {/* 🌍 שפת ממשק */}
                    <Text style={styles.label}>שפת ממשק:</Text>
                    <TextInput
                        style={styles.input}
                        value={language}
                        onChangeText={setLanguage}
                        placeholder="בחר שפה"
                    />

                    {/* 🔍 אפשרות להציג פתרונות מודרכים */}
                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>הצגת פתרונות מודרכים מפורטים:</Text>
                        <Switch
                            value={detailedSolutions}
                            onValueChange={setDetailedSolutions}
                        />
                    </View>

                    {/* 💾 כפתור שמירה */}
                    <Pressable onPress={saveUserData} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>💾 שמירת שינויים</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15
    },
    loadingText: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20
    },
    label: {
        fontSize: 18,
        marginBottom: 5
    },
    staticText: {
        fontSize: 16,
        backgroundColor: '#f3f3f3',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    saveButton: {
        backgroundColor: 'blue',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18
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
