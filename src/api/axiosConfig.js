// src/api/axiosConfig.js
import axios from 'axios';
import { Platform } from 'react-native';

// כתובת ה-Backend – אנדרואיד אמולאטור צריך 10.0.2.2
const BASE_URL =
    Platform.OS === 'android'
        ? 'http://10.0.2.2:8080'
        : 'http://localhost:8080';

// instance יחידה של axios
export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,    // ⬅️ שולח ומקבל cookies
});
