import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

export default function Index() {
    const [checking, setChecking] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        axios.get('/api/user')
            .then(res => {
                if (res.data.success) setIsLoggedIn(true);
            })
            .catch(err => {
                // 401 => לא מחובר
            })
            .finally(() => setChecking(false));
    }, []);

    if (checking) return null;

    return isLoggedIn
        ? <Redirect href="/(tabs)/Dashboard" />
        : <Redirect href="/authentication/Login" />;
}
