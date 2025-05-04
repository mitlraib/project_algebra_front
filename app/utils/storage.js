// /app/utils/storage.js
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
    async set(key, value) {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        }
    },
    async get(key) {
        if (Platform.OS === 'web') {
            const json = localStorage.getItem(key);
            return json ? JSON.parse(json) : null;
        } else {
            const json = await AsyncStorage.getItem(key);
            return json ? JSON.parse(json) : null;
        }
    },
    async remove(key) {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    },
};

export default storage;
