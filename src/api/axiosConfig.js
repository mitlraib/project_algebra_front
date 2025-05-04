// src/api/axiosConfig.js
import axios from 'axios';
import storage from '../../app/utils/storage';
import { Platform } from 'react-native';

// production בפרודקשן ישתמש ב־env, בפיתוח ב־emulator/local
const BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL
    ?? (Platform.OS === 'android'
        ? 'http://10.0.2.2:8080'
        : 'http://localhost:8080');

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,   // אנחנו לא עובדים עם עוגיות, אלא עם ה־Authorization header
});

// שולחים אוטומטית לכל קריאה את ה־Bearer token
api.interceptors.request.use(async config => {
    const token = await storage.get('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
