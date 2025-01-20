import React, { useState, useEffect, useCallback } from 'react';
import {Text, View, ScrollView, TextInput, StyleSheet, StatusBar, Platform,
  Image, Pressable, Alert} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

import { Colors } from '../../constants/Colors';
import { Sizes,Spacing } from '../../constants/Sizes';
// import { useAuth } from '../src/context/AuthContext';
import SafePressable from '../../components/common/SafePressable';


export const Registration = ({ }) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [tel, setTel] = useState('');


  const [firstNameMessage, setFirstNameMessage] = useState('');
  const [lastNameMessage, setLastNameMessage] = useState('');
  const [PasswordMessage, setPasswordMessage] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [telMessage, setTelMessage] = useState('');


  const [login, setLogin] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigate,setIsNavigate]=useState(false)

  const router = useRouter();
  // const {register: _register, user} = useAuth()

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  // useEffect(() => {
  //   if (user) {
  //     router.navigate('/swipepage/SwipePage')
  //   }
  // }, [user])
  
  

  const moveToLoginPage = useCallback( () => {
    if (isNavigate) return
    try {
      setIsNavigate(true)
      router.replace('/authentication/Login');
      router.push({
        pathname: '/authentication/Login',
        params: {
          reset:true
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setIsNavigate(false)
      },500)
    }
     
 
    
  },[isNavigate])

 


  // הפיכת מספר הטלפון למספרים בלבד:
  const handleTelChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setTel(numericText);
  };

  const validateFields = () => {
    let isValid=true
  


  // ולידציה של שם :
    if (!(firstName.length>1)) {
      isValid = false
      
      if (firstName.length < 1) {
        setFirstNameMessage('נא למלא שם פרטי ')
      }
      if (0 < firstName.length < 2) {
        setFirstNameMessage('השם הפרטי שלך קצר מדי!')
      }
    }

    if (!(lastName.length>1)) {
      isValid = false
      
      
      if (lastName.length < 1) {
        setLastNameMessage('נא למלא שם משפחה ')
      }
      if (0 < lastName.length < 2) {
        setLastNameMessage('השם משפחה שלך קצר מדי!')
      }
    }

  // ולידציה של סיסמה:
    if (!(password.length > 6 && password.length <= 30)) {
      isValid = false
      if (password.length < 7) {
        setPasswordMessage('הסיסמה חייבת להיות מעל 6 ספרות!')
      }
          
      if (password.length > 30) {
       setPasswordMessage('אופסס.. הסתחררנו... לסיסמה שלך יש יותר מדי ספרות...')
          
    }
    }
    
    
  // ולידציה של מייל:
  if (!(mail.includes("@"))) {
    isValid = false
    setMailMessage('אופס.. נראה לנו שהמייל שלך לא תקין...')
  }

    // ולידציה של מספר טלפון:
    if (!((tel.length === 9 || tel.length === 10) && tel[0] === '0')) {
      
      isValid = false

      if (tel.length < 9) {
        setTelMessage('אופס.. נראה לנו שחסר לך כמה ספרות..')
 
      } 

      if (tel.length > 10) {
        setTelMessage ('אופס.. נראה לנו שיש לך כמה ספרות מיותרות כאן..')
      }

      if (tel[0] !== '0') {
        setTelMessage('שים לב! מספר הטלפון חייב להתחיל בספרה 0!')
      }
      }
    


    return isValid
  }

  // const register = async (e) => {
  //   e.preventDefault()
  
  //   console.log(validateFields())
  //   if (validateFields()) {
  //   if (!registered) {
  //     setRegistered(true);
  //   }
   
  //   try {
  //     await _register({
  //       firstName,
  //       lastName,
  //       password,
  //       email:mail,
  //       tel,
  //       experience,
  //       aboutYou
  //     })
  //     setRegistered(true)
  //     Alert.alert(
  //       hebrew ?"הצלחה":"Success"
  //     )
  //   } catch (error) {
  //     console.error(error)
  //   }

  //   setLogin(true);
  //   }

  // };

 


  return (
    <ScrollView >

    <View style={styles.container} >
      {!login ? (
        <>

          
            {/* כותרת */}
          <Text style={styles.welcomeText}>הרשמה בקלות ובמהירות:</Text>
      
          
            
            {/* שם משתמש */}
            <View style={styles.textInput_wrapper}>

            <TextInput
                id='firstName'
                style={styles.textInput}
                onChangeText={setFirstName}
                autoComplete='given-name'
                placeholder={" שם פרטי :"}
              />
            </View>
            
            <Text style={styles.messageText}>{firstNameMessage}</Text>


           <View style={styles.textInput_wrapper}>

              <TextInput
                id='lastName'
                style={styles.textInput}
                onChangeText={setLastName}
                placeholder={ " שם משפחה :" }
                autoComplete='family-name'
              />
              
            </View>
            <Text style={styles.messageText}>{lastNameMessage}</Text>

            
           
            {/* סיסמה */}
            <View style={styles.textInput_wrapper}>
            <View style={[{ flexDirection: 'row' }, {marginRight:-40}]}>
            <TextInput
                  id='Password'
                    style={styles.textInput}
                  onChangeText={setPassword}
                    placeholder={" סיסמה :"}
                  secureTextEntry={!showPassword}
                />
                 {/* כפתור הצגת/הסתרת סיסמה */}
                 <Pressable onPress={toggleShowPassword}>
                  <Image
                        source={{ uri: 'https://as2.ftcdn.net/jpg/01/46/11/95/220_F_146119533_BAlUoUk3eo9eSXBnMuMdUDPvLdeLpWJr.jpg' }}
                    style={styles.eyeIcon}
                  />
                </Pressable> 
              </View>
              <Text style={styles.messageText}>{PasswordMessage}</Text>
              </View>
            

            {/* מייל */}
            <View style={styles.textInput_wrapper}>

              <TextInput
                id='mail'
                style = {styles.textInput}
                onChangeText={setMail}
                placeholder={" אימייל :"}
            
              />
           
           <Text style={styles.messageText}>{mailMessage}</Text>
           </View>

            
            {/* מספר טלפון */}
            <View style={styles.textInput_wrapper}>

         <TextInput
                id='tel'
                style={styles.textInput}
                onChangeText={handleTelChange}
                keyboardType="numeric"
                value={tel}
                placeholder={ "טלפון :" }
              />
             
             <Text style={styles.messageText}>{telMessage}</Text>
             </View>
   
            
                       

          

            {/* כפתור שליחה */}

        
            <View  style={styles.registerButton}>
              <Pressable
                // onPress={register}
                  style={styles.button}
              >
                <Text style={styles.registerText}>  הרשם! </Text>
              </Pressable>
            </View>



           
            {/* חזרה להתחברות */}

            <View style={styles.login}>
              <Text style={styles.g}> כבר יש לך חשבון אצלנו? </Text> 
              <Pressable
                onPress={moveToLoginPage}
                style={styles.v}
                disabled={isNavigate}
              >
                <Text style={{color:Colors.purple}}> התחבר </Text>
              </Pressable>
            </View>



        </>
      ) : (
        <View>
        {moveToLoginPage}
        </View>
      )}
      </View>
      </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.purpleIsh,
    paddingTop: Spacing.lg,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1
  },
  welcomeText: {
    fontSize: Spacing.xxl,
    textAlign: 'center',
    marginBottom: 25
  },
  textInput: {
    margin: Spacing.lg,
    width: 200,
    fontSize: 12,
    textAlign: 'right',
    borderColor: Colors.purple,
    borderWidth: 2,
    paddingHorizontal: 10,
    color: Colors.black,
  },
  textInput_wrapper: {
    marginTop: Spacing.sm,
    fontSize: 12,
    alignItems:'center'
  },
  password: {
    marginTop: Spacing.md,
      width: 200,
      fontSize: 12,
    textAlign: 'right',
      borderColor: 'black',
      borderWidth: 1,
      backgroundColor: Colors.pinkIsh,
      paddingHorizontal: 10,
  marginLeft:30
  },
  messageText: {
    fontSize: 14,
    color: Colors.Burgundy,
    textAlign: 'center',
    flexWrap: 'nowrap',
    fontWeight:'bold'

  },
  eyeIcon: {
    width: 35,
    height: 35,
    marginTop: 25,
    marginLeft:10

  },
  login: {
    paddingTop: Spacing.lg,
    paddingBottom: 200,
    flexDirection:'row-reverse',
    alignSelf:'center',
    fontSize: 13,
  },
  registerText: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center', 
   
  },
  registerButton: {
    marginTop: Spacing.lg,
    width: 75,
    height: 35,
    paddingTop: 5,
    backgroundColor: Colors.white,
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: Colors.relativePurple,

      alignSelf:'center'
  },

  
 
 
});

export default Registration;
