import React, { useState } from 'react';
import { View, Text, TextInput, Button, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';
import styles from '../../styles/styles';
import { Spacing } from '@/constants/Sizes';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

export default function Register() {
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!firstName || !lastName || !mail || !password) {
            alert("מלא את כל השדות!");
            return;
        }
        if (password !== confirmPassword) {
            alert("סיסמאות לא תואמות!");
            return;
        }

        try {
            console.log("About to send register request...");
            const response = await axios.post('/api/register', {
                firstName, lastName, mail, password
            });
            console.log("Server responded:", response.data);
            if (response.data.success) {
                alert("ההרשמה הצליחה!");
                // לאחר רישום, מפנה למסך כניסה
                router.push('/authentication/Login');
            } else {
                alert("ההרשמה נכשלה!");
                console.log("Register error:", response.data.message);
            }
        } catch (error) {
            console.log("Error during registration:", error);
        }
    };

    const toggleShowPassword = () => setShowPassword(p => !p);
    const moveToLogin = () => router.push('/authentication/Login');

    return (
        <ProtectedRoute requireAuth={false}>
            <View style={styles.container}>
                <Text style={styles.header}>הרשמה</Text>
                <TextInput
                    style={styles.input}
                    placeholder="שם פרטי"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="שם משפחה"
                    value={lastName}
                    onChangeText={setLastName}
                />
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
                <TextInput
                    style={styles.input}
                    placeholder="אימות סיסמה"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                />

                <Button title="הרשם" onPress={handleRegister} />

                <View style={{ flexDirection: "row", marginTop: Spacing.lg, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Text style={styles.text}>כבר יש לך חשבון?</Text>
                    <Pressable onPress={moveToLogin}>
                        <Text style={styles.linkText}> התחבר</Text>
                    </Pressable>
                </View>
            </View>
        </ProtectedRoute>
    );
}
