import React, { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    Pressable,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Spacing } from '../../constants/Sizes';
import { authStyles, dashboardStyles } from '../../styles/styles';
import storage from '../utils/storage';
import { Colors } from '../../constants/Colors';
import api from '../../src/api/axiosConfig';

/**
 * Login screen – handles user authentication, stores JWT in local storage
 * and redirects to the Dashboard once authenticated.
 */
export default function Login() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ mail: '', password: '', form: '' });

    const router = useRouter();

    /* ──────────────── helpers ──────────────── */
    const toggleShowPassword = () => setShowPassword(!showPassword);

    const moveToRegistration = () => router.push('/authentication/Register');

    /**
     * Validate individual input fields.
     */
    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };
        switch (fieldName) {
            case 'mail':
                newErrors.mail = !value.includes('@') ? 'כתובת המייל לא תקינה' : '';
                break;
            case 'password':
                newErrors.password = value.length < 6 ? 'הסיסמה חייבת להיות לפחות 6 תווים' : '';
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    /**
     * Submit credentials → receive JWT → save & redirect.
     */
    const handleLogin = async (e) => {debugger;
        e.preventDefault();
        setErrors((e) => ({ ...e, form: '' }));

        if (!mail || !password) {
            setErrors((e) => ({ ...e, form: 'אנא מלא אימייל וסיסמה' }));
            return;
        }

        try {
            const { data } = await api.post('/api/login', { mail, password });
            console.log('login response', data);
            if (data.success && data.token) {

                await storage.set('userToken', data.token);
                setMail('');
                setPassword('');
                router.replace('(tabs)/Dashboard');
            } else {
                setErrors((e) => ({ ...e, form: data.message || 'שגיאה בהתחברות' }));
            }
        } catch (err) {
            console.error('login error', err);
            setErrors((e) => ({ ...e, form: 'שגיאה כללית בשרת' }));
        }
    };

    /* ──────────────── UI ──────────────── */
    return (
        <ProtectedRoute requireAuth={false}>
            <ScrollView contentContainerStyle={authStyles.container}>
                {/* Title */}
                <View style={{ marginBottom: 40, marginTop: 30 }}>
                    <LinearGradient
                        colors={[Colors.primary, Colors.accent]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={dashboardStyles.gradientTitleWrapper}
                    >
                        <Text style={dashboardStyles.gradientTitle}>MathJourney!</Text>
                    </LinearGradient>
                </View>

                {/* Card */}
                <View style={authStyles.cardContainer}>
                    <Text style={authStyles.bigBoldText}>כניסה לאזור אישי:</Text>

                    {!!errors.form && <Text style={authStyles.errorText}>{errors.form}</Text>}

                    {/* email */}
                    <TextInput
                        style={authStyles.loginInput}
                        placeholder="אימייל"
                        value={mail}
                        onChangeText={(text) => {
                            setMail(text);
                            validateField('mail', text);
                        }}
                    />
                    {!!errors.mail && <Text style={authStyles.errorText}>{errors.mail}</Text>}

                    {/* password */}
                    <View style={authStyles.passwordWrapper}>
                        <TextInput
                            style={authStyles.passwordInput}
                            placeholder="סיסמה"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                validateField('password', text);
                            }}
                            secureTextEntry={!showPassword}
                        />
                        <Pressable onPress={toggleShowPassword} style={authStyles.emojiButton}>
                            <Text style={authStyles.emojiText}>{showPassword ? '🙉' : '🙈'}</Text>
                        </Pressable>
                    </View>
                    {!!errors.password && <Text style={authStyles.errorText}>{errors.password}</Text>}

                    {/* login button */}
                    <TouchableOpacity style={authStyles.primaryButton} onPress={handleLogin}>
                        <Text style={authStyles.primaryButtonText}>התחבר</Text>
                    </TouchableOpacity>

                    {/* link to register */}
                    <View
                        style={{ flexDirection: 'row', marginTop: Spacing.lg, justifyContent: 'center' }}
                    >
                        <View style={{ marginTop: Spacing.lg, alignItems: 'center' }}>
                            <Text style={authStyles.text}>לא רשומים עדיין לאתר?</Text>
                            <Pressable onPress={moveToRegistration}>
                                <Text style={[authStyles.linkText, { marginTop: 4 }]}>הרשמו!</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ProtectedRoute>
    );
}
