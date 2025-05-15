// /components/ui/AuthProvider.js
import React, { createContext, useEffect, useState } from 'react';
import api from '../../src/api/axiosConfig';
import storage from '../../app/utils/storage';

export const AuthContext = createContext({
    user: null,
    isInit: false,
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        // קודם מנסים לטעון מה-Local Storage
        const loadUserFromCache = async () => {
            const cachedUser = await storage.get('cachedUser');
            if (cachedUser) {
                setUser(JSON.parse(cachedUser));
                setIsInit(true);
            }

            // בדיקת התחברות מהשרת
            try {
                const { data } = await api.get('/api/user');
                if (data.success) {
                    setUser(data);
                    await storage.set('cachedUser', JSON.stringify(data)); // שומרים ב-Cache
                } else {
                    await storage.remove('cachedUser');
                    await storage.remove('userToken');
                    setUser(null);
                }
            } catch (err) {
                await storage.remove('cachedUser');
                await storage.remove('userToken');
                setUser(null);
            } finally {
                setIsInit(true);
            }
        };

        loadUserFromCache();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isInit }}>
            {children}
        </AuthContext.Provider>
    );
}