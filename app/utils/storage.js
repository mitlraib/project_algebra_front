import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cookie from 'js-cookie';     // נשאר לשימוש ב-Web

export const storage = {
    async set(key, value, options) {
        return Platform.OS === 'web'
            ? Cookie.set(key, value, options)
            : AsyncStorage.setItem(key, value);
    },
    async get(key) {
        return Platform.OS === 'web'
            ? Cookie.get(key)
            : AsyncStorage.getItem(key);
    },
    async remove(key) {
        return Platform.OS === 'web'
            ? Cookie.remove(key)
            : AsyncStorage.removeItem(key);
    },
};
