//ProtectedRoute

import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function ProtectedRoute({ children, requireAuth }) {
    const [isInit, setIsInit] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // נבדוק /api/user רק אם ממש צריך (או אם requireAuth=true)
        // או שאפשר תמיד לבדוק.
        if (requireAuth) {
            axios.get('/api/user')
                .then(res => {
                    if (res.data && res.data.success) {
                        setUser(res.data);
                    } else {
                        Cookies.remove('userToken');
                        setUser(null);
                    }
                })
                .catch(() => {
                    Cookies.remove('userToken');
                    setUser(null);
                })
                .finally(() => {
                    setIsInit(true);
                });
        } else {
            // עמוד שלא דורש auth
            setIsInit(true);
        }
    }, [requireAuth]);

    if (!isInit && requireAuth) {
        // בזמן הטעינה
        return null;
    }

    // אם הדף דורש התחברות אבל אין user => להפנות ל-login
    if (requireAuth && !user) {
        return <Redirect href="/authentication/Login" />;
    }

    // אם הדף לא דורש התחברות, אבל יש user => להפנות ל-dashboard
    if (!requireAuth && user) {
        return <Redirect href="/(tabs)/Dashboard" />;
    }

    // מציגים את הילדים כרגיל
    return children;
}

//end of ProtectedRoute