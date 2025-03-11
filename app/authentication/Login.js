
import React, { useState } from 'react';
import {Text, View, TextInput, StyleSheet, StatusBar, Platform, Image, Pressable, Button} from 'react-native';
import { useRouter } from 'expo-router';
import { Sizes, Spacing } from '@/constants/Sizes';
import styles from '../../styles/styles';
import axios from "axios"; //   ייבוא הסטיילים
import Cookies from 'js-cookie';
import ProtectedRoute from '../../components/ProtectedRoute';

const Login = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hovered, setHovered] = useState(false); // מצב ריחוף
    const router = useRouter();
    const [errors, setErrors] = useState({
        mail: '',
        password: '',
    });

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const moveToRegistration = () => {
        router.navigate('/authentication/Register');
    };

    const moveToDashboard = () => {
        router.navigate('/(tabs)/Dashboard');
    };

    const handleLogin = async () => {
        if (mail && password) { // אם המייל והסיסמא קיימים
            try {
                const loginData = {
                    mail,
                    password,
                };

                const response = await axios.post('http://localhost:8080/api/login', loginData);

                console.log("Response from server:", response.data);

                if (response.data.success) {
                    alert("ההתחברות הצליחה!");
                    Cookies.set('userToken', response.data.token, { expires: 7 });
                    setMail('');
                    setPassword('');
                    moveToDashboard();

                    //router.push(''); // שינוי לדף הרלוונטי
                } else {
                    alert("שם המשתמש או הסיסמה שגויים");
                    console.log("Error:", response.data.message);
                }
            } catch (error) {
                console.error('Error during login:', error.response ? error.response.data : error.message);
            }
        } else {
            alert("יש למלא את המייל והסיסמה");
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


    const validateFields = () => {
        return (
            validateField('mail') &&
            validateField('password')
        );
    }
    return (
        <ProtectedRoute requireAuth={false}>

        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.header}>כניסה לאיזור האישי:</Text>

                {/* Mail */}
                <TextInput
                    style={styles.input}
                    placeholder={": אימייל "}
                    value={mail}
                    onChangeText={(text)=>{
                        setMail(text);
                        validateField('mail');
                    }}
                    onBlur={() => validateField('mail')}  // הבדיקה תתבצע רק כשהמשתמש עוזב את השדה
                />
                {errors.mail ? <Text style={styles.errorText}>{errors.mail}</Text> : null}


                {/* Password */}
                <View style={styles.passwordContainer}>
                    <Pressable onPress={toggleShowPassword}>
                        <Image
                            source={{ uri: 'https://as2.ftcdn.net/jpg/01/46/11/95/220_F_146119533_BAlUoUk3eo9eSXBnMuMdUDPvLdeLpWJr.jpg' }}
                            style={styles.eyeIcon}
                        />
                    </Pressable>

                    <TextInput
                        style={styles.input}
                        placeholder={": סיסמה "}
                        onChangeText={(text) => {
                            setPassword(text);
                            validateField('password');
                        }}
                        onBlur={() => validateField('password')}
                        secureTextEntry={!showPassword}
                    />
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                <View >

                </View>

                {/* Login Button */}
                <View style={styles.buttonContainer}>
                    <Button
                        title="התחבר"
                        onPress={handleLogin}
                    />
                </View>
                {/* Register Button   */}
                <View style={{ flexDirection: "row", marginTop: Spacing.lg, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Text style={styles.text}>לא רשומים עדיין לאפליקציה?</Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: Spacing.lg, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Pressable
                        onPress={moveToRegistration}  // הוספת הניווט בלחיצה
                        onMouseEnter={() => setHovered(true)}  //   הגדרת מצב ריחוף
                        onMouseLeave={() => setHovered(false)} // הגדרת מצב יציאה מריחוף
                        style={[
                            styles.button,
                            hovered && styles.buttonActive,  // שינוי צבע בריחוף
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