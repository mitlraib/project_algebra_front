//Login

import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Image, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { Spacing } from '@/constants/Sizes';
import styles, {dashboardStyles} from '../../styles/styles';
import axios from "axios";
import ProtectedRoute from '../../components/ProtectedRoute';
import Cookies from 'js-cookie';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

const Login = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [errors, setErrors] = useState({ mail: '', password: '', form: '' });

    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (!navigationState?.key) return;
        const userToken = Cookies.get('userToken');
        if (userToken) {
            router.replace('/(tabs)/Dashboard');
        }
    }, [navigationState?.key, router]);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const moveToRegistration = () => {
        router.push('/authentication/Register');
    };

    const handleLogin = async () => {
        setErrors({ ...errors, form: '' });

        if (!mail || !password) {
            setErrors({ ...errors, form: 'אנא מלא אימייל וסיסמה' });
            return;
        }

        try {
            const loginData = { mail, password };
            const response = await axios.post('http://localhost:8080/api/login', loginData);

            if (response.data.success) {
                alert("ההתחברות הצליחה!");
                Cookies.set('userToken', response.data.token, { expires: 7 });
                setMail('');
                setPassword('');
                router.replace('/(tabs)/Dashboard');
            } else {
                setErrors({ ...errors, form: response.data.message || 'תקלה לא ידועה' });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors({ ...errors, form: error.response.data.message });
            } else {
                setErrors({ ...errors, form: 'שגיאה כללית בשרת' });
            }
        }
    };

    const validateField = (fieldName, value) => {
        let valid = true;
        let newErrors = { ...errors };

        switch (fieldName) {
            case 'mail':
                if (!value || !value.includes('@')) {
                    newErrors.mail = 'כתובת המייל לא תקינה';
                    valid = false;
                } else {
                    newErrors.mail = '';
                }
                break;
            case 'password':
                if (!value || value.length < 6) {
                    newErrors.password = 'הסיסמה חייבת להיות לפחות 6 תווים';
                    valid = false;
                } else {
                    newErrors.password = '';
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return valid;
    };

    return (
        <ProtectedRoute requireAuth={false}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ marginBottom: 100 }}>
                    <LinearGradient
                        colors={[Colors.primary, Colors.accent]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={dashboardStyles.gradientTitleWrapper}
                    >
                        <Text style={dashboardStyles.gradientTitle}>ברוכים הבאים ל MathJourney!</Text>
                    </LinearGradient>
                </View>

                <View style={styles.cardContainer}>

                    <Text style={styles.bigBoldText}>כניסה לאזור אישי:</Text>

                    {errors.form ? (
                        <Text style={styles.errorText}>{errors.form}</Text>
                    ) : null}

                    <TextInput
                        style={styles.loginInput}
                        placeholder="אימייל"
                        value={mail}
                        onChangeText={(text) => {
                            setMail(text);
                            validateField('mail', text);
                        }}
                    />
                    {errors.mail ? <Text style={styles.errorText}>{errors.mail}</Text> : null}
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="סיסמה"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                validateField('password', text);
                            }}
                            secureTextEntry={!showPassword}
                        />
                        <Pressable onPress={toggleShowPassword} style={styles.emojiButton}>
                            <Text style={styles.emojiText}>
                                {showPassword ? '🙈' : '🙉'}
                            </Text>
                        </Pressable>
                    </View>



                    {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                    <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                        <Text style={styles.primaryButtonText}>התחבר</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', marginTop: Spacing.lg, justifyContent: 'center' }}>
                        <View style={{ marginTop: Spacing.lg, alignItems: 'center' }}>
                            <Text style={styles.text}>לא רשומים עדיין לאפליקציה?</Text>
                            <Pressable onPress={moveToRegistration}>
                                <Text style={[styles.linkText, { marginTop: 4 }]}>הרשמו!</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </ProtectedRoute>
    );
};

export default Login;