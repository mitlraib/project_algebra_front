import React, { useState } from 'react';
import { View, Text, TextInput, Button, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';
import styles from '../../styles/styles';
import { Spacing } from '@/constants/Sizes';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

export default function Login() {
    const router = useRouter();
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleLogin = async () => {
        if (!mail || !password) {
            alert("יש למלא אימייל וסיסמה");
            return;
        }

        try {
            console.log("About to send login request...");
            const response = await axios.post('/api/login', { mail, password });
            console.log("Server responded:", response.data);

            if (response.data.success) {
                alert("ההתחברות הצליחה!");
                // אין לנו טוקן, כי זה Session. פשוט נעבור לדשבורד
                router.push('/(tabs)/Dashboard');
            } else {
                alert("שם המשתמש או הסיסמה שגויים");
                console.log("Server error:", response.data.message);
            }
        } catch (error) {
            console.log("Error during login:", error);
        }
    };

    const moveToRegister = () => {
        router.push('/authentication/Register');
    };

    return (
        <ProtectedRoute requireAuth={false}>
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Text style={styles.header}>כניסה לאיזור האישי:</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="אימייל"
                        value={mail}
                        onChangeText={setMail}
                    />

                    <View style={styles.passwordContainer}>
                        <Pressable onPress={toggleShowPassword}>
                            <Image
                                source={{ uri: 'https://as2.ftcdn.net/jpg/01/46/11/95/220_F_146119533_BAlUoUk3eo9eSXBnMuMdUDPvLdeLpWJr.jpg' }}
                                style={styles.eyeIcon}
                            />
                        </Pressable>
                        <TextInput
                            style={styles.input}
                            placeholder="סיסמה"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                    </View>

                    <Button title="התחבר" onPress={handleLogin} />

                    <View style={{ flexDirection: "row", marginTop: Spacing.lg, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Text style={styles.text}>לא רשומים עדיין?</Text>
                        <Pressable onPress={moveToRegister}>
                            <Text style={styles.linkText}> הרשם כאן</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ProtectedRoute>
    );
}
