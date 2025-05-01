// Register.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import  { authStyles, dashboardStyles } from '../../styles/styles';
import { Spacing } from "../../constants/Sizes";
import ProtectedRoute from '../../components/ProtectedRoute';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { api } from  'components/api';

export const Register = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        mail: '',
        password: '',
        confirmPassword: ''
    });

    const validateField = (fieldName, value) => {
        let valid = true;
        let newErrors = { ...errors };

        switch (fieldName) {
            case 'firstName':
                newErrors.firstName = value ? '' : 'אנא מלא את השם הפרטי';
                valid = !!value;
                break;
            case 'lastName':
                newErrors.lastName = value ? '' : 'אנא מלא את שם המשפחה';
                valid = !!value;
                break;
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
            case 'confirmPassword':
                if (!value || value !== password) {
                    newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
                    valid = false;
                } else {
                    newErrors.confirmPassword = 'אימות סיסמה תקין ✅';
                }
                break;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleFieldChange = (fieldName, newValue) => {
        switch (fieldName) {
            case 'firstName':
                setFirstName(newValue);
                break;
            case 'lastName':
                setLastName(newValue);
                break;
            case 'mail':
                setMail(newValue);
                break;
            case 'password':
                setPassword(newValue);
                break;
            case 'confirmPassword':
                setConfirmPassword(newValue);
                break;
        }
        validateField(fieldName, newValue);
    };

    const validateAllFields = () => {
        return (
            validateField('firstName', firstName) &&
            validateField('lastName', lastName) &&
            validateField('mail', mail) &&
            validateField('password', password) &&
            validateField('confirmPassword', confirmPassword)
        );
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleRegistration = async () => {
        if (!validateAllFields()) return;

        try {
            const userData = { firstName, lastName, mail, password };

            const response = await api.post('/api/register', userData);

            if (response.data.success) {
                alert( "ההרשמה הצליחה!");
                // איפוס
                setFirstName('');
                setLastName('');
                setMail('');
                setPassword('');
                setConfirmPassword('');
                router.push('/authentication/Login');
            } else {
                Alert.alert("שגיאה", response.data.message || "ההרשמה נכשלה, נסה שוב");
            }
        } catch (error) {
            if (error.response) {
                //  טיפול מיוחד ל-500 - המייל כבר קיים
                if (error.response.status === 500) {
                    alert("למייל הזה כבר יש משתמש! ", error.response.data.message);
                } else if (error.response.data?.message) {
                    alert("שגיאה בהרשמה שלך", error.response.data.message);
                } else {
                    alert("שגיאה", "ההרשמה נכשלה. נסה שוב מאוחר יותר.");
                }
            } else {
                alert("שגיאה", "ההרשמה נכשלה. נסה שוב מאוחר יותר.");
            }
            console.error('Error during registration:', error.response?.data || error.message);
        }
    };


    const moveToLoginPage = () => {
        router.push('/authentication/Login');
    };

    return (
        <ProtectedRoute requireAuth={false}>
            <View contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={{ marginBottom: 40, marginTop:30 }}>
                    <LinearGradient
                        colors={[Colors.primary, Colors.accent]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={dashboardStyles.gradientTitleWrapper}
                    >
                        <Text style={dashboardStyles.gradientTitle}> MathJourney!</Text>
                    </LinearGradient>
                </View>

                <View style={authStyles.cardContainer}>
                    <Text style={authStyles.bigBoldText}>הרשמה:</Text>

                    <TextInput
                        style={authStyles.loginInput}
                        placeholder="שם פרטי"
                        value={firstName}
                        onChangeText={(text) => handleFieldChange('firstName', text)}
                    />
                    {errors.firstName ? <Text style={authStyles.errorText}>{errors.firstName}</Text> : null}

                    <TextInput
                        style={authStyles.loginInput}
                        placeholder="שם משפחה"
                        value={lastName}
                        onChangeText={(text) => handleFieldChange('lastName', text)}
                    />
                    {errors.lastName ? <Text style={authStyles.errorText}>{errors.lastName}</Text> : null}

                    <TextInput
                        style={authStyles.loginInput}
                        placeholder="אימייל"
                        value={mail}
                        onChangeText={(text) => handleFieldChange('mail', text)}
                        keyboardType="email-address"
                    />
                    {errors.mail ? <Text style={authStyles.errorText}>{errors.mail}</Text> : null}

                    <View style={authStyles.passwordWrapper}>
                        <TextInput
                            style={authStyles.passwordInput}
                            placeholder="סיסמה"
                            value={password}
                            onChangeText={(text) => handleFieldChange('password', text)}
                            secureTextEntry={!showPassword}
                        />
                        <Pressable onPress={toggleShowPassword} style={authStyles.emojiButton}>
                            <Text style={authStyles.emojiText}>
                                {showPassword ? '🙉' : '🙈'}
                            </Text>
                        </Pressable>
                    </View>
                    {errors.password ? <Text style={authStyles.errorText}>{errors.password}</Text> : null}

                    <TextInput
                        style={authStyles.loginInput}
                        placeholder="אימות סיסמה"
                        value={confirmPassword}
                        onChangeText={(text) => handleFieldChange('confirmPassword', text)}
                        secureTextEntry={!showPassword}
                    />
                    {errors.confirmPassword ? (
                        <Text style={[authStyles.errorText, errors.confirmPassword.includes('✅') && authStyles.successText]}>
                            {errors.confirmPassword}
                        </Text>
                    ) : null}

                    <TouchableOpacity style={authStyles.primaryButton} onPress={handleRegistration}>
                        <Text style={authStyles.primaryButtonText}>הרשם</Text>
                    </TouchableOpacity>

                    <View style={{ marginTop: Spacing.lg, alignItems: 'center' }}>
                        <Text style={authStyles.text}>כבר יש לך חשבון אצלנו?</Text>
                        <Pressable onPress={moveToLoginPage}>
                            <Text style={[authStyles.linkText, { marginTop: 4 }]}>התחבר</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ProtectedRoute>
    );
};

export default Register;
