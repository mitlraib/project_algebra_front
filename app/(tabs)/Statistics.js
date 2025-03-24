import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../styles/styles';

export default function Statistics() {
    const router = useRouter();
    const [role, setRole] = useState(null);  // נשמור את התפקיד במצב
    const [loading, setLoading] = useState(true);  // מצב טעינה

    // פונקציה לשליפת תפקיד המשתמש
    const fetchUserRole = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/user/topics-levels/role', {
                method: 'GET',
                credentials: 'include',  // אם אתה משתמש ב-cookies/session
            });

            if (!response.ok) {
                throw new Error('לא ניתן לשלוף את התפקיד');
            }

            const data = await response.json();
            setRole(data.role);  // עדכון התפקיד במצב
        } catch (err) {
            console.error('שגיאה בעת שליפת התפקיד:', err);
        } finally {
            setLoading(false);  // סיום טעינה
        }
    };

    useEffect(() => {
        fetchUserRole();  // קריאה לפונקציה בעת טעינת הרכיב
    }, []);

    useEffect(() => {
        // אם המשתמש אינו מנהל, ננווט אותו לדף אחר
        if (!loading && role !== 'admin') {
            alert("אין לך הרשאה לצפות בעמוד זה.");
            router.push('/Dashboard');
        }
    }, [role, loading]);

    function handleGoBack() {
        router.push('/Dashboard');
    }

    // אם עדיין בטעינה, מציגים את ה-ActivityIndicator
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // אם המשתמש אינו מנהל, לא נציג כלום (כי כבר ניווטנו אותו החוצה)
    if (role !== 'admin') {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>סטטיסטיקה</Text>
            <Pressable onPress={handleGoBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>🔙 חזרה למסך הראשי</Text>
            </Pressable>

            <View>
                <Text>אתה מנהל, אתה יכול לראות את כל הנתונים.</Text>
                {/* תוכל להוסיף כאן את הנתונים שברצונך להציג רק למנהל */}
            </View>
        </View>
    );
};
