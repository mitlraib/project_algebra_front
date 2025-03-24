import { StyleSheet } from 'react-native';
import { Colors as colors } from '../constants/Colors';

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
        paddingRight: 10,
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
    linkText: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    button: {
        padding: 5,
        borderRadius: 5,
        opacity: 1,
    },
    buttonActive: {
        backgroundColor: '#2196F3',
    },
    successText: {
        color: 'green',
        fontSize: 14,
        marginTop: 5,
    },
    dashboardBackground: {
        backgroundColor: colors.lightBlue,
    },

    //  סגנון לכרטיסיות (נושאים)

    card: {
        width: 200,  //  קובע רוחב קבוע
        height: 200, //  קובע גובה קבוע
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // צל לכרטיס
        borderRadius: 10,
        margin: 10,
        padding: 15,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 5,

    },
    cardTitle: {
        fontSize: 18, // ✨ הגדלת טקסט
        fontWeight: 'bold',
        textAlign: 'center',
    },
    centerArea: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        textAlign: 'left',
        alignSelf: 'flex-end',
        top: 20,
        left: 10,
        backgroundColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        zIndex: 10
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
        textAlign: 'center'
    },
    label: {
        fontSize: 18,
        marginBottom: 5
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center'
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16
    },
    appTitle: {
        fontSize: 60, // גודל גדול
        fontWeight: 'bold', // הגדרת גופן עבה
        color: '#2196F3', // צבע גופן מעניין (אפשר לשנות לצבע שתרצה)
        //marginBottom: 10, // רווח בין הטקסט לתמונה או אלמנטים אחרים
        fontFamily: 'Lato', //
        marginTop: 120, // הוספת רווח מעל התת-כותרת

    },
    appSubtitle: {
        fontSize: 40, // גודל טקסט קטן יותר
        fontWeight: 'normal',
        color: '#2196F3', // צבע חיוור יותר לטקסט השני
        textAlign: 'center', // ממקם את הטקסט במרכז
        marginBottom: 450, // רווח תחת הטקסט
        fontFamily: 'Cochin', // גופן פשוט יותר לקריאות
        //marginTop: 1, // הוספת רווח מעל הכותרת
    },
    imageStyle: {
        width: 500, // רוחב התמונה
        height: 500, // גובה התמונה
        //  marginBottom: 10, // רווח מתחת לתמונה
        resizeMode: 'contain', // לשמור על יחס הגובה לרוחב של התמונה
        borderRadius: 100, // קצוות מעוגלים
        shadowColor: '#000', // צבע הצל
        shadowOffset: { width: 0, height: 5 }, // מרחק הצל
        shadowOpacity: 0.3, // שקיפות הצל
        shadowRadius: 10, // רדיוס הצל
        elevation: 10, // הצל באנדרואיד
    },
    question: {
        fontSize: 20,
        marginBottom: 20,
        marginTop: 70,
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    answerButton: {
        padding: 8,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
        width: '80%',
        alignSelf: 'center'
    },
    selectedAnswer: {
        backgroundColor: '#ddd'
    },
    answerText: {
        fontSize: 16,
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    checkButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    checkButtonText: {
        color: 'white',
        fontSize: 18
    },
    resultText: {
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center'
    },
    nextButton: {
        marginTop: 20,
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18
    },
    centerAll: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 15,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorMessage: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
    },

});

export default styles;