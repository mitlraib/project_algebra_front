import {Dimensions, StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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
        backgroundColor: Colors.lightBlue,
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
    subjectContainer: {
        flex: 1,
        padding: 20,}

});
const dashboardStyles = StyleSheet.create({
    scrollContainer: {
        alignItems: 'center',
        backgroundColor: '#f8f6ff',
    },
    header: {
        width:wp(80),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    logo: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    mathColor:{
        color: Colors.primary
    },
    JourneyColor:{
        color: Colors.accent
    },
    logoutIconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    logoutLabel: {
        color: Colors.primary,
        fontWeight: '600',
        marginRight: 6,
        fontSize: 14,
    },
    gradientTitleWrapper: {
        borderRadius: 20,
        padding: 10,
        alignSelf:'center',
        width:500,
        height: 55
    },
    gradientTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
    },
    floatingSymbol: {
        position: 'absolute',
        top: 100,
        right: 20,
        opacity: 0.15,
    },
    bottomLeft: {
        top: undefined,
        bottom: 150,
        left: 20,
        right: undefined,
    },
    floatingText: {
        fontSize: 64,
    },
    rowWrapper: {
        flexDirection: 'row', // כדי שהריבוע יהיה בשמאל
        justifyContent:'center',
        alignItems: 'center',
        marginTop:30,
        gap: wp(2),
    },
    statisticsBox: {
        width: 210,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ede9fe',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    titleWrapper: {
       height: hp(9),
        width: wp(40),
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'center',
    },
    statisticsDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 16,
    },
    statisticsButton: {
        backgroundColor: Colors.accent,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginTop: 8,
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    statisticsButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    columnWrapper:{
        flexDirection:'column',
        alignItems:'space-between',
        justifyContent:'space-between',
        paddingRight:wp(5)
    },
    marathonBox: {
        width: wp(14),
        height: hp(30),
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom:70,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    marathonDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 16,
    },
    marathonButton: {
        backgroundColor: Colors.accent,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginTop: 8,
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    marathonButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    achievementsBox: {
        width: wp(14),
        height: hp (30),
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: wp(1),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    achievementsDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 16,
    },
    achievementsButton: {
        backgroundColor: Colors.accent,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginTop: 8,
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    achievementsButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    mainCard: {
        width: width > 768 ? 709 : '96%',
        padding: 24,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 50,
        height: hp(70)
    },
    mainBCard: {
        width: wp(40),
        padding: 24,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 50,
    },
    imageStyle: {
        width: wp(40),
        height: hp(25),
        borderRadius: 16,
        marginBottom: 16,
    },
    greetingText: {
        marginTop:10,
        marginRight:60,
        marginLeft:60,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#7c3aed',
    },
    emojiCircle: {
        backgroundColor: '#ede9fe',
        borderRadius: 100,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    emoji: {
        fontSize: 40,
    },
    secondGreetingText: {
        marginTop:10,
        marginLeft:50,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#7c3aed',
        marginBottom: 14,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    progressText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    progressBarContainer: {
        position: 'relative',
        height: 25,
        justifyContent: 'center',
    },
    progress: {
        height: 15,
        borderRadius: 10,
        marginTop: 20,

    },
    cardPercentage: {
        marginTop:-5,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 12,
    },
    pillButtonPurple: {
        height:hp(7),
        width:wp(35),
        marginTop: 10,
        backgroundColor: Colors.primary,
        paddingVertical: 4,
        borderRadius: 100,
        alignItems: 'center',
    },
    pillButtonOrange: {
        backgroundColor: Colors.accent,
        paddingVertical: 14,
        borderRadius: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});




const myCoursesStyles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#f8f6ff',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 25,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 24,
        marginTop:15,
        marginLeft:15
    },
    backButtonText: {
        fontSize: 16,
        color: Colors.accent,
        fontWeight: '600',
    },
    courseBox: {
        width: width * 0.9,
        marginBottom: 32,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        overflow: 'hidden',
    },
    courseHeader: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.primary,
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    topicGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 16,
    },
    topicCardWrapper: {
        width: 100,
        marginBottom: 20,
    },
    topicCard: {
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    topicText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
        textAlign: 'center',
        marginTop: 6,
    },
});
const myProfileStyles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 24,
    },
    profileContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxWidth: 600,
        marginRight:20
    },
    statisticContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: 900,
        alignSelf: 'flex-end',
        marginRight:20,
        marginBottom:20
    },

    levelsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: 900,
        alignSelf: 'flex-end',
        marginRight:20
    },


    statisticSquere: {
        backgroundColor: '#8F9CB3',
        borderRadius: 12,
        padding: 20,
        width: 200,
        textAlign:'center',
        alignItems: 'center',
        margin:50,
    },
    backButton: {
        marginBottom: 16,
        alignSelf: 'flex-start',
        marginLeft:15,

    },
    backButtonText: {
        color: '#4F46E5',
        fontWeight: '600',
    },
    avatarWrapper: {
        backgroundColor: '#e3e7f4', // תואם לרקע שבתמונה שלך
        borderRadius: 100,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        width: 170,
        height: 170,
        alignSelf:"center"
    },
    avatarImage: {
        width: 140,
        height: 150,
        borderRadius: 100,
        resizeMode: 'cover',
        backgroundColor: '#ddd'

    },
    avatarText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop:20
    },
    subText: {
        color: '#555',
        marginBottom: 20,
        fontSize:16
    },
    card: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,

    },
    profileLabels: {
        flexDirection: 'row-reverse',
        textAlign:"right",
        margin: 10,
    },

    input: {
        fontSize: 18,
        paddingTop:2
    },
    switchContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
    },
    saveButton: {
        backgroundColor: '#4F46E5',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#4F46E5',
    },

    profileSectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 50,
        color: '#4F46E5',
        textAlign:'center',
    },
    topicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    topicText: {
        fontSize: 16,
        flex: 1,
    },
    lowerButton: {
        backgroundColor: '#E5E7EB',
        padding: 6,
        borderRadius: 6,
        marginLeft: 10,
    },
    lowerButtonText: {
        color: '#2563EB',
        fontWeight: '500',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
    },
    iconBox: {
        backgroundColor: '#e3e7f4', // תואם לרקע שבתמונה שלך
        borderRadius: 60,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        width: 50,
        height: 50,
    },
    backButtonGradient: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginRight: 16,
        marginTop: 8,
        width: 200, // קטן יותר
    },
    saveButtonGradient: {
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignSelf: 'center',
        marginVertical: 16,
        width: 350, // גדול יותר
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }


});


export {dashboardStyles,myCoursesStyles, myProfileStyles}
export default styles;