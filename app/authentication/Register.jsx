import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';  // הוספת ה-import של useRouter

export const Register = () => {
    const router = useRouter();  // יצירת משתנה router
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
                if (!password || password.length <= 6) {
                    newErrors.password = 'הסיסמה חייבת להיות לפחות 6 תווים';
                    valid = false;
                } else {
                    newErrors.password = '';
                }
                break;
            case 'confirmPassword':
                if (password !== confirmPassword) {
                    newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
                    valid = false;
                } else {
                    newErrors.confirmPassword = '';
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleRegistration = () => {
        if (validateFields()) {
            console.log("הרשמה הצליחה");
        }
    };

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
                onChangeText={(text) => {
                    setEmail(text);
                    validateField('email');
                }}
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
                    secureTextEntry={!showPassword}
                />
                <Pressable onPress={toggleShowPassword}>
                    <Image
                        source={{ uri: 'https://as2.ftcdn.net/jpg/01/46/11/95/220_F_146119533_BAlUoUk3eo9eSXBnMuMdUDPvLdeLpWJr.jpg' }}
                        style={styles.eyeIcon}
                    />
                </Pressable>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="אימות סיסמה"
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        validateField('confirmPassword');
                    }}
                    secureTextEntry={!showPassword}
                />
                <Pressable onPress={toggleShowPassword}>
                    <Image
                        source={{ uri: 'https://as2.ftcdn.net/jpg/01/46/11/95/220_F_146119533_BAlUoUk3eo9eSXBnMuMdUDPvLdeLpWJr.jpg' }}
                        style={styles.eyeIcon}
                    />
                </Pressable>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

            <View style={styles.buttonContainer}>
                <Button
                    title="הרשם"
                    onPress={handleRegistration}
                />
            </View>

            <View style={styles.input}>
                <Text style={styles.text}> כבר יש לך חשבון אצלנו? </Text>
                <Pressable
                    onPress={moveToLoginPage}  // הוספת הניווט בלחיצה
                >
                    <Text style={styles.text}> התחבר </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        width: '30%',
        alignSelf: 'center',
        fontSize: 14,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        alignSelf: 'center',
    },
    eyeIcon: {
        width: 40,
        height: 40,
        position: 'absolute',
        right: -48,
        top: -26,
    },
    buttonContainer: {
        width: '30%',
        marginTop: 20,
        alignSelf: 'center',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '90%',
        alignSelf: 'center',
        marginLeft: '60%',
    },
    text: {
        fontSize: 14,
        color: 'black',
        marginBottom: 10,
    }
});

export default Register;