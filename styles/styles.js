// styles.js
import { StyleSheet } from 'react-native';
import {Colors as colors, Colors} from '../constants/Colors';

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
        textAlign: 'right',
        paddingRight:10
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        alignSelf: 'center',
    },
    eyeIcon: {
        width: 30,
        height: 30,
        position: 'absolute',
        right: -40,
        top: -20,
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
        width: '100%',
        alignSelf: 'center',
        marginLeft: '70%',
    },
    text: {
        fontSize: 14,
        color: 'black',
        marginBottom: 10,
    },

    // סגנון של הטקסט עם פס תחתון
    linkText: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },

    // סגנון של הכפתור
    button: {
        padding: 5,
        borderRadius: 5,
        opacity: 1, // יש לשמור על אטימות רגילה
    },
// סגנון של הכפתור בריחוף
    buttonActive: {
        backgroundColor: 'blue', // צבע background בעת נגיעה
    },
    successText: {
        color: 'green',
        fontSize: 14,
        marginTop: 5,
    },

    dashboardBackground:{
        backgroundColor: colors.lightBlue,
    }
});

export default styles;