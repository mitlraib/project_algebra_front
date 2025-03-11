import React, {useState, useCallback, useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';  // הוספת ה-import של useRouter
import styles from '../../styles/styles.js';
import {Spacing} from "../../constants/Sizes";
import axios from "axios";
import ProtectedRoute from '../../components/ProtectedRoute';
import Cookies from 'js-cookie';



export const Register = () => {
    const router = useRouter();  // יצירת משתנה router
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
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
        mail: '',
        password: '',
        confirmPassword: ''
    });
    const moveToDashboard = () => {
        router.navigate('/(tabs)/Dashboard');
    };

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
            case 'confirmPassword':
                if (!confirmPassword || password !== confirmPassword) {
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


    const validateFields = () => {
        return (
            validateField('firstName') &&
            validateField('lastName') &&
            validateField('mail') &&
            validateField('password') &&
            validateField('confirmPassword')
        );
    };

    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };


    const moveToLoginPage = () => {
        router.push('/authentication/Login');  // ניווט
    };
    const handleRegistration = async () => {
        if (validateFields()) {
            try {
                const userData = {
                    firstName,
                    lastName,
                    mail,
                    password,
                };
                const response = await axios.post('http://localhost:8080/api/register', userData);

                console.log("Response from server:", response.data);

                if (response.data.success) {
                    moveToLoginPage()
                    alert("ההרשמה הצליחה!");
                    console.log("הרשמה הצליחה");

                    // איפוס השדות אחרי הרשמה מוצלחת
                    setFirstName('');
                    setLastName('');
                    setMail('');
                    setPassword('');
                    setConfirmPassword('');

                    //router.push('/authentication/Login');
                } else {
                    alert("ההרשמה נכשלה, נסה שוב");
                    console.log("הרשמה נכשלה:", response.data.message);
                }
            } catch (error) {
                console.error('Error during registration:', error.response ? error.response.data : error.message);
            }
        }
    };
    return (
        <ProtectedRoute requireAuth={false}>

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
                value={mail}
                onChangeText={(text)=>{
                    setMail(text);
                    validateField('mail');
                }}  // כאן לא נבדוק את השדה מיד
                onBlur={() => validateField('mail')}  // הבדיקה תתבצע רק כשהמשתמש עוזב את השדה
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
                    onChangeText={(text) => {
                        setPassword(text);
                        validateField('password');
                    }}
                    onBlur={() => validateField('password')}  // הבדיקה תתבצע רק כשהמשתמש עוזב את השדה
                    //onFocus={() => setTouched({ ...touched, password: true })}
                    secureTextEntry={!showPassword}
                />
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            <View >
                <TextInput
                    style={styles.input}
                    placeholder="אימות סיסמה"
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        validateField('confirmPassword');
                    }}
                    onBlur={() => validateField('confirmPassword')}  // הבדיקה תתבצע רק כשהמשתמש עוזב את השדה
                    //onFocus={() => setTouched({ ...touched, confirmPassword: true })}
                    secureTextEntry={!showPassword}
                />

            </View>

            <Text style={[styles.errorText, errors.confirmPassword.includes('✅') && styles.successText]}>
                {errors.confirmPassword}

            </Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="הרשם"
                    onPress={()=>{
                        handleRegistration();
                    }}
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
        </ProtectedRoute>
    );
};


export default Register;