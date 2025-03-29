//Login

import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Image, Pressable, Button } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { Spacing } from '@/constants/Sizes';
import styles from '../../styles/styles';
import axios from "axios";
import ProtectedRoute from '../../components/ProtectedRoute';
import Cookies from 'js-cookie';


const Login = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [errors, setErrors] = useState({ mail: '', password: '', form: '' });

    const router = useRouter();
    // נבדוק האם ה־Navigation מוכן
    const navigationState = useRootNavigationState();

    // 1. אם כבר מחוברים, נפנה מיד ל־Dashboard
    useEffect(() => {
        // אם ה־router לא מוכן עדיין, לא לעשות כלום
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

    // 2. לחיצה על "התחבר"
    const handleLogin = async () => {
        // ננקה הודעת שגיאה קודמת (אם יש)
        setErrors({ ...errors, form: '' });

        // בדיקה בסיסית של שדות
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
                // מעבר ל־Dashboard
                router.replace('/(tabs)/Dashboard');
            } else {
                // אם הגיע לכאן בלי success, כנראה שהשרת החזיר status = 200 אבל success=false
                // נשים הודעת שגיאה כוללת:
                setErrors({ ...errors, form: response.data.message || 'תקלה לא ידועה' });
            }
        } catch (error) {
            // אם הסטטוס הוא 401 או 400, נקבל response.data עם message
            if (error.response && error.response.data) {
                setErrors({ ...errors, form: error.response.data.message });
            } else {
                setErrors({ ...errors, form: 'שגיאה כללית בשרת' });
            }
        }
    };

    const validateField = (fieldName) => {
        let valid = true;
        let newErrors = { ...errors };

        switch (fieldName) {
            case 'mail':
                if (!mail || !mail.includes('@')) {
                    newErrors.mail = 'כתובת המייל לא תקינה';
                    valid = false;
                } else {
                    newErrors.mail = '';
                }
                break;
            case 'password':
                if (!password || password.length < 6) {
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
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Text style={styles.header}>כניסה לאיזור האישי:</Text>

                    {errors.form ? (
                        <Text style={styles.errorText}>{errors.form}</Text>
                    ) : null}

                    {/* אימייל */}
                    <TextInput
                        style={styles.input}
                        placeholder="אימייל"
                        value={mail}
                        onChangeText={(text) => {
                            setMail(text);
                            validateField('mail');
                        }}
                        onBlur={() => validateField('mail')}
                    />
                    {errors.mail ? <Text style={styles.errorText}>{errors.mail}</Text> : null}

                    {/* סיסמה */}
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
                            onChangeText={(text) => {
                                setPassword(text);
                                validateField('password');
                            }}
                            onBlur={() => validateField('password')}
                            secureTextEntry={!showPassword}
                        />
                    </View>
                    {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                    {/* כפתור התחברות */}
                    <View style={styles.buttonContainer}>
                        <Button
                            title="התחבר"
                            onPress={handleLogin}
                        />
                    </View>

                    {/* מעבר לעמוד הרשמה */}
                    <View style={{ flexDirection: "row", marginTop: Spacing.lg, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Text style={styles.text}>לא רשומים עדיין לאפליקציה?</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: Spacing.lg, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Pressable
                            onPress={moveToRegistration}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            style={[
                                styles.button,
                                hovered && styles.buttonActive,
                            ]}
                        >
                            <Text style={styles.linkText}>הירשמו!</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ProtectedRoute>
    );
};

export default Login;


//end of Login
