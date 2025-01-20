import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, StyleSheet,StatusBar,Platform, Image, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';


import { Colors } from '../../constants/Colors';
import { Sizes,Spacing } from '../../constants/Sizes';

// import { storeData, storeString } from '../src/utils/storage';

// import eyeIconImage from '../../assets/images/eye.png';
// import { useAuth } from '../src/context/AuthContext';



export const Login = () => {
 
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(true);
  const router = useRouter()
//   const {login, user} = useAuth()


//   useEffect(() => {
//     if (user) {
//       router.navigate('/(tabs)/Dashboard')
//     }
//   },[user])

  
  // const handleLogin = async () => {
  //   try {
  //     await login(mail,password)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  
  const moveToRegistration = () => {
    router.navigate('/authentication/Registration')
  };
  
  const moveToDashboard = () => {
    router.navigate('/(tabs)/Dashboard')
    };



  const register = () => {
    setRegistered(!registered);
  };

  return (
    <View style={styles.container}>

   

        <View style={styles.innerContainer}>

        
          <Text style={styles.welcomeText}> כניסה לאיזור האישי:</Text>


          {/* Mail */}
          <TextInput
            style={styles.textInput}
            onChangeText={setMail}
            placeholder={"אימייל :"}
            value={mail}
          />
          

          {/* Password: */}
          <View style={styles.textInput_wrapper}>
              <View style={[{ flexDirection: 'row' }, {marginRight:-40}]}>
          <TextInput
                  id='Password'
                    style={styles.textInput}
                  onChangeText={setPassword}
                    placeholder={" סיסמה :"}
                  secureTextEntry={!showPassword}
            />
            
           
            <Pressable onPress={toggleShowPassword}>
            <Image
                        source={{ uri: 'https://as2.ftcdn.net/jpg/01/46/11/95/220_F_146119533_BAlUoUk3eo9eSXBnMuMdUDPvLdeLpWJr.jpg' }}
                        style={styles.eyeIcon} /> 
            </Pressable>
          </View>
          </View>


          {/* Login button: */}

              <Pressable
                  onPress={moveToDashboard}
                  style={styles.button}>
            <Text style={styles.buttonText}>{ "התחבר" }</Text>
          </Pressable>

          
         {/* Register button: */}
          <View style={{flexDirection: "row-reverse", marginTop: Spacing.lg, alignItems: 'center'}}>
            <Text style={styles.register}> לא רשומים עדיין לאפליקציה? </Text>
                  <Pressable
                      onPress={moveToRegistration}
                      style={styles.registerButton}>
              <Text style={styles.registerButtonText}>הירשמו!</Text>
            </Pressable>
          </View>
        </View>
 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.lg,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : '20px',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  textInput_wrapper: {
    marginTop: Spacing.sm,
    fontSize: 12,
    alignItems:'center'
  },
  textInput: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    borderColor:Colors.purple,
    borderWidth:2,
    width: 250,
    height: 45,
    textAlign: 'right',
    paddingHorizontal: 10,

  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    width: 35,
    height: 35,
    marginTop: 25,
    marginLeft:10

  },
  button: {
    marginTop: Spacing.md,
    width: '30%',
    height: 45,
  backgroundColor: '#BC68F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth:1,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
  },
  
  register: {
    fontSize: 16,
    color: Colors.white,
  },
  registerButton: {
    marginLeft: 10,
  },
  registerButtonText: {
    color: Colors.purple,
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 30,
    marginBottom: Spacing.xxxl,
    marginTop: 50
  },
});

export default Login;
