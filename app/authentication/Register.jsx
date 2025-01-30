import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';  // הוספת ה-import של useRouter
import styles from '../../styles/styles.js';
import {Spacing} from "../../constants/Sizes"; // חזור שני שלבים אחורה לתוך תיקיית styles

export const Register = () => {
    const router = useRouter();  // יצירת משתנה router
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [hovered, setHovered] = useState(false); // מצב ריחוף
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({
        password: false,
        confirmPassword: false
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });


    const validateField = (fieldName) => {
        let valid = true;
        let newErrors = { ...errors };

        switch (fieldName) {
            case 'firstName':
                if (!firstName) {
                    newErrors.firstName = 'אנא מלא את שם הפרטי';
                    valid = false;
                } else {
                    newErrors.firstName = '';
                }
                break;
            case 'lastName':
                if (!lastName) {
                    newErrors.lastName = 'אנא מלא את שם המשפחה';
                    valid = false;
                } else {
                    newErrors.lastName = '';
                }
                break;
            case 'email':
                if (!email || !email.includes('@')) {
                    newErrors.email = 'כתובת המייל לא תקינה';
                    valid = false;
                } else {
                    newErrors.email = '';
                }
                break;
            case 'password':
                if (!password || password.length < 6) {
                    newErrors.password = 'הסיסמה חייבת להיות לפחות 6 תווים';
                    valid = false;
                } else {
                    newErrors.password = '✅ הסיסמה תקינה';
                }
                break;
            case 'confirmPassword':
                if (password !== confirmPassword) {
                    newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
                    valid = false;
                } else {
                    newErrors.confirmPassword = '✅ אימות סיסמה תקין';
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return valid;
    };
    //
    // const handleRegistration = () => {
    //     if (validateFields()) {
    //         console.log("הרשמה הצליחה");
    //     }
    // };

    const validateFields = () => {
        return (
            validateField('firstName') &&
            validateField('lastName') &&
            validateField('email') &&
            validateField('password') &&
            validateField('confirmPassword')
        );
    };

    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const moveToLoginPage = () => {
        router.push('/authentication/Login');  // הניווט יקרה פה
    };
    const handleRegistration = async () => {
        if (validateFields()) {
            try {
                const userData = {
                    firstName,
                    lastName,
                    email,
                    password,
                };

                // שליחה של הנתונים ל-API
                const response = await axios.post('https://localhost:8080/api/register', userData);

                if (response.data.success) {
                    console.log("הרשמה הצליחה");
                    // ניווט לעמוד הבא לאחר הצלחה
                    router.push('/authentication/Login');
                } else {
                    console.log("הרשמה נכשלה");
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>הרשמה</Text>

            <TextInput
                style={styles.input}
                placeholder="שם פרטי"
                value={firstName}
                onChangeText={(text) => {
                    setFirstName(text);
                    validateField('firstName');
                }}
                onBlur={() => validateField('firstName')}
            />
            {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="שם משפחה"
                value={lastName}
                onChangeText={(text) => {
                    setLastName(text);
                    validateField('lastName');
                }}
                onBlur={() => validateField('lastName')}
            />
            {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="מייל"
                value={email}
                onChangeText={setEmail}  // כאן לא נבדוק את השדה מיד
                onBlur={() => validateField('email')}  // הבדיקה תתבצע רק כשהמשתמש עוזב את השדה
                keyboardType="email-address"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="סיסמה"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        validateField('password');
                    }}
                    onFocus={() => setTouched({ ...touched, password: true })}
                    secureTextEntry={!showPassword}
                />
                <Pressable onPress={toggleShowPassword}>
                    <Image
                        source={{ uri: 'https://as2.ftcdn.net/jpg/01/46/11/95/220_F_146119533_BAlUoUk3eo9eSXBnMuMdUDPvLdeLpWJr.jpg' }}
                        style={styles.eyeIcon}
                    />
                </Pressable>
            </View>
            {touched.password && (
                <Text style={[styles.errorText, errors.password.includes('✅') && styles.successText]}>
                    {errors.password}
                </Text>
            )}
            <View >
                <TextInput
                    style={styles.input}
                    placeholder="אימות סיסמה"
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        validateField('confirmPassword');
                    }}
                    onFocus={() => setTouched({ ...touched, confirmPassword: true })}
                    secureTextEntry={!showPassword}
                />
                {/*<Pressable onPress={toggleShowPassword}>*/}
                {/*    <Image*/}
                {/*        source={{ uri: 'https://as2.ftcdn.net/jpg/01/46/11/95/220_F_146119533_BAlUoUk3eo9eSXBnMuMdUDPvLdeLpWJr.jpg' }}*/}
                {/*        style={styles.eyeIcon}*/}
                {/*    />*/}
                {/*</Pressable>*/}
            </View>
            {touched.confirmPassword && (
                <Text style={[styles.errorText, errors.confirmPassword.includes('✅') && styles.successText]}>
                    {errors.confirmPassword}
                </Text>
            )}
            <View style={styles.buttonContainer}>
                <Button
                    title="הרשם"
                    onPress={validateFields}
                />
            </View>

            <View style={{ flexDirection: "row", marginTop: Spacing.lg, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Text style={styles.text}> כבר יש לך חשבון אצלנו? </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: Spacing.lg, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Pressable
                    onPress={moveToLoginPage}  // הוספת הניווט בלחיצה
                    onMouseEnter={() => setHovered(true)}  // הגדרת מצב ריחוף
                    onMouseLeave={() => setHovered(false)} // הגדרת מצב יציאה מריחוף
                    style={[
                        styles.button,
                        hovered && styles.buttonActive,  // שינוי צבע בריחוף
                    ]}
                >
                    <Text style={styles.linkText}>התחבר</Text>
                </Pressable>
            </View>
        </View>
    );
};


export default Register;