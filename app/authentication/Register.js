import React, { useState } from 'react';
import { View, Text, TextInput, Button, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../styles/styles.js';
import { Spacing } from "../../constants/Sizes";
import axios from "axios";
import ProtectedRoute from '../../components/ProtectedRoute';

export const Register = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [hovered, setHovered] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
                if (!value) {
                    newErrors.firstName = 'אנא מלא את השם הפרטי';
                    valid = false;
                } else {
                    newErrors.firstName = '';
                }
                break;
            case 'lastName':
                if (!value) {
                    newErrors.lastName = 'אנא מלא את שם המשפחה';
                    valid = false;
                } else {
                    newErrors.lastName = '';
                }
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
                    newErrors.confirmPassword = ' אימות סיסמה תקין ✅';
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleFieldChange = (fieldName, newValue) => {
        // עדכון state
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
        // בדיקה מיידית
        validateField(fieldName, newValue);
    };

    const validateAllFields = () => {
        // נוודא שהכל תקין
        const f1 = validateField('firstName', firstName);
        const f2 = validateField('lastName', lastName);
        const f3 = validateField('mail', mail);
        const f4 = validateField('password', password);
        const f5 = validateField('confirmPassword', confirmPassword);
        return (f1 && f2 && f3 && f4 && f5);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleRegistration = async () => {
        if (!validateAllFields()) {
            return;
        }
        try {
            const userData = {
                firstName,
                lastName,
                mail,
                password
            };
            const response = await axios.post('http://localhost:8080/api/register', userData);

            if (response.data.success) {
                Alert.alert("Success", "ההרשמה הצליחה!");
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
            // אם הסטטוס הוא 500 וההודעה מכילה "המייל כבר קיים"
            if (error.response && error.response.data && error.response.data.message) {
                Alert.alert("שגיאה בהרשמה", error.response.data.message);
            } else {
                Alert.alert("שגיאה", "ההרשמה נכשלה. נסה שוב מאוחר יותר.");
            }
            console.log("Error during registration:", error.response ? error.response.data : error.message);
        }
    };

    const moveToLoginPage = () => {
        router.push('/authentication/Login');
    };

    return (
        <ProtectedRoute requireAuth={false}>
            <View style={styles.container}>
                <Text style={styles.header}>הרשמה</Text>

                <TextInput
                    style={styles.input}
                    placeholder="שם פרטי"
                    value={firstName}
                    onChangeText={(text) => handleFieldChange('firstName', text)}
                />
                {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="שם משפחה"
                    value={lastName}
                    onChangeText={(text) => handleFieldChange('lastName', text)}
                />
                {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="מייל"
                    value={mail}
                    onChangeText={(text) => handleFieldChange('mail', text)}
                    keyboardType="email-address"
                />
                {errors.mail ? <Text style={styles.errorText}>{errors.mail}</Text> : null}

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
                        onChangeText={(text) => handleFieldChange('password', text)}
                        secureTextEntry={!showPassword}
                    />
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="אימות סיסמה"
                    value={confirmPassword}
                    onChangeText={(text) => handleFieldChange('confirmPassword', text)}
                    secureTextEntry={!showPassword}
                />
                {errors.confirmPassword ? (
                    <Text style={[styles.errorText, errors.confirmPassword.includes('✅') && styles.successText]}>
                        {errors.confirmPassword}
                    </Text>
                ) : null}

                <View style={styles.buttonContainer}>
                    <Button title="הרשם" onPress={handleRegistration} />
                </View>

                <View style={{ flexDirection: "row", marginTop: Spacing.lg, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Text style={styles.text}>כבר יש לך חשבון אצלנו?</Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: Spacing.lg, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Pressable
                        onPress={moveToLoginPage}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        style={[styles.button, hovered && styles.buttonActive]}
                    >
                        <Text style={styles.linkText}>התחבר</Text>
                    </Pressable>
                </View>
            </View>
        </ProtectedRoute>
    );
};

export default Register;
