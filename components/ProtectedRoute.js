import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import axios from 'axios';

// הגדרות בסיסיות ל-axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

/**
 * @param {children} children - הקומפוננטה שבאמת נרצה להציג
 * @param {requireAuth} boolean - האם הדף הזה דורש התחברות?
 */
export default function ProtectedRoute({ children, requireAuth }) {
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (requireAuth) {
            // קוראים לשרת לבדוק אם session קיים
            axios.get('/api/user')
                .then(res => {
                    if (res.data && res.data.success) {
                        setIsAuthenticated(true);
                    }
                })
                .catch(err => {
                    // אם נקבל 401 -> לא מחובר
                    setIsAuthenticated(false);
                })
                .finally(() => setCheckingAuth(false));
        } else {
            // אם לא דרוש auth, לא חייבים לבדוק
            setCheckingAuth(false);
        }
    }, [requireAuth]);

    if (checkingAuth) {
        return null; // מציגים "ריק" עד שנדע
    }

    if (requireAuth && !isAuthenticated) {
        // צריך התחברות, אבל לא מחוברים => מעבירים ללוגין
        return <Redirect href="/authentication/Login" />;
    }

    if (!requireAuth && isAuthenticated) {
        // אם המשתמש מחובר אבל העמוד לא דורש התחברות (למשל לוגין)
        // עדיף להפנות אותו לדשבורד
        return <Redirect href="/(tabs)/Dashboard" />;
    }

    return children;
}
