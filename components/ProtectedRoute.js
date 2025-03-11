import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import Cookies from 'js-cookie';

export default function ProtectedRoute({ children, requireAuth }) {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const token = Cookies.get('userToken');
        setUser(token || null);
        setCheckingAuth(false);
    }, []);

    if (checkingAuth) {
        return null; // מחכה לוודא את הסטטוס של המשתמש
    }

    if (requireAuth && !user) {
        return <Redirect href="/authentication/Login" />; // אם צריך חיבור והמשתמש לא מחובר
    }

    if (!requireAuth && user) {
        return <Redirect href="/(tabs)/Dashboard" />; // אם המשתמש מחובר והוא בעמוד התחברות
    }

    return children;
}
