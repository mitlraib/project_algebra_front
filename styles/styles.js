import {Dimensions, StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const width = Dimensions.get('window').width;

const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,

    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 12,
        width: '100%',
        fontSize: 18,
        backgroundColor: Colors.grayish,
        textAlign: 'right',
        alignSelf: 'center',
    },
    gradientTitleBox: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        alignSelf: 'center',
        width: '100%',
        backgroundColor: Colors.primary, // אם צריך רקע fallback
    },
    cardContainer: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 24,
        shadowColor: Colors.black,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 100,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    primaryButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
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
    roundedInput: {
        height: 50,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 12,
        width: '100%',
        fontSize: 16,
        backgroundColor: Colors.white,
    },

    loginInput: {
        height: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 12,
        width: '100%',
        fontSize: 18,
        backgroundColor: Colors.grayish,
        textAlign: 'right',
        alignSelf: 'center',
    },
    bigBoldText: {
        fontSize: 24,      // גודל טקסט גדול
        fontWeight: 'bold', // טקסט מודגש
        color: 'black',     // צבע ברור (או כל צבע שתרצי)
        textAlign: 'center', // יישור למרכז אם צריך
        marginBottom: 20,   // רווח מלמטה
    },

    emojiText: {
        fontSize: 24,
    },
    passwordContainer: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
    },

    inputWithEmoji: {
        height: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingRight: 50, // רווח לאימוג׳י
        marginBottom: 12,
        width: '100%',
        fontSize: 18,
        backgroundColor: Colors.grayish,
        textAlign: 'right',
    },

    emojiButtonInside: {
        position: 'absolute',
        top: 12,
        left: 20,
    },
    passwordWrapper: {
        position: 'relative',
        width: '100%',
        alignSelf: 'center',
        marginBottom: 12,
    },

    passwordInput: {
        height: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingLeft: 50, // מקום לאימוג'י
        width: '100%',
        fontSize: 18,
        backgroundColor: Colors.grayish,
        textAlign: 'right',
    },

    emojiButton: {
        position: 'absolute',
        left: 15,
        top: 10,
    },



    eyePressable: {
        position: 'absolute',
        right: 20,
        top: 10,
    },


    text: {
        fontSize: 14,
        color: 'black',
        marginBottom: 10,
    },
    linkText: {
        color: Colors.primary,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    button: {
        padding: 5,
        borderRadius: 5,
        opacity: 1,
    },
    buttonActive: {
        backgroundColor: Colors.dodgerBlue,
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
        backgroundColor: Colors.white,
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
        backgroundColor: Colors.grayish,
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
        backgroundColor: Colors.dodgerBlue,
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
        color: Colors.dodgerBlue, // צבע גופן מעניין (אפשר לשנות לצבע שתרצה)
        fontFamily: 'Lato', //
        marginTop: 120, // הוספת רווח מעל התת-כותרת

    },
    appSubtitle: {
        fontSize: 40, // גודל טקסט קטן יותר
        fontWeight: 'normal',
        color: Colors.dodgerBlue, // צבע חיוור יותר לטקסט השני
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
        shadowColor: Colors.black, // צבע הצל
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
        backgroundColor: Colors.grayish
    },
    answerText: {
        fontSize: 16,
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    checkButton: {
        marginTop: 20,
        backgroundColor: Colors.green,
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
        backgroundColor: Colors.dodgerBlue,
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
        backgroundColor: Colors.white,
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
        backgroundColor: Colors.dodgerBlue,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: Colors.white,
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
const achievementsStyles = StyleSheet.create({
    scroll: {
        paddingVertical: 32,
        alignItems: "center",
    },
    container: {
        marginTop:70,
        width: "90%",
        maxWidth: 700,
    },
    backButton: {
        alignSelf: "flex-start",
        marginBottom: 8,
        marginLeft: 10,
    },
    backButtonText: {
        color: "#8b5cf6",
        fontWeight: "600",
        fontSize: 18,
    },
    titleBox: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    },
    starsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
    },
    starsText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#444",
    },
    badgeCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    badgeHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    badgeIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeTitle: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#111827",
    },
    badgeDesc: {
        color: "#555",
        fontSize: 13,
        marginTop: 2,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#E5E7EB",
    },
    progressFill: {
        height: 8,
        borderRadius: 8,
    },
    progressText: {
        fontSize: 11,
        color: "#444",
        width: 40,
        textAlign: "right",
    },
    mathChampionBox: {
        marginTop: 20,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    mathChampionText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
        color: "#4B0082",
        lineHeight: 26,
    },
});
const dashboardStyles = StyleSheet.create({
    scrollContainer: {
        alignItems: 'center',
        backgroundColor:Colors.background,
    },
    header: {
        width:wp(90),
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
        color: Colors.white,
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        gap: wp(2),
        minHeight: hp(70),
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    titleWrapper: {
        height: hp(9),
        width: wp(40),
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
        textAlign: 'center',
        marginBottom: 16, // או יותר אם צריך
    },
    statisticsDescription: {
        fontSize: 14,
        color: Colors.darkGray,
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
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    columnWrapper:{
        marginTop:8,
        alignSelf: 'flex-start',
        alignContent: 'flex-start',
        paddingRight:wp(5)
    },
    box: {
        width: wp(14),
        height: hp(30),
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom:70,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    marathonDescription: {
        fontSize: 14,
        color: Colors.darkGray,
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
        textAlign:'center',
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    achievementsDescription: {
        fontSize: 14,
        color: Colors.darkGray,
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
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    mainCard: {
        width: width > 768 ? 709 : '96%',
        alignSelf: 'flex-start',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: 20,
        backgroundColor: Colors.white,
        marginRight: 50,
        height: hp(100)
    },
    mainBCard: {
        alignSelf: 'flex-start',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        height: hp(100),
        width: wp(40),
        padding: 24,
        borderRadius: 20,
        backgroundColor: Colors.white,
        marginRight: 50,
    },
    imageStyle: {
        width: wp(40),
        height: hp(25),
        borderRadius: 16,
        marginBottom: 16,
        marginTop: 16, // כדי להרחיק מהכותרת
    },
    greetingText: {
        marginTop:10,
        marginBottom:20,
        marginRight:60,
        marginLeft:60,
        fontSize: 20,
        fontWeight: '600',
        color: Colors.secondary
    },
    emojiCircle: {
        backgroundColor: Colors.light,
        marginLeft: wp(2),
        borderRadius: 100,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    emoji: {
        fontSize: 40,

    },

    cardContainer: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: Colors.black,
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    progressText: {
        color: Colors.black,
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
        height: 20,
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
        marginTop: 30,
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
        color: Colors.white,
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
        backgroundColor: Colors.background,
        alignItems: 'center',
    },
    title: {
        marginTop:70,
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
        backgroundColor: Colors.white,
        borderRadius: 20,
        shadowColor: Colors.black,
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
        color: Colors.white,
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
        shadowColor: Colors.black,
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
    wrapper: {
        width: 100,  // כפתור ברוחב קבוע
        marginHorizontal: 15,
        marginVertical: 10,
        alignItems: 'center',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        padding: 8,
    },
    label: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: '600',
        color: Colors.primary,
        textAlign: 'center',
    },
});
const myProfileStyles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 24,
    },
    profileContainer: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 20,
        maxWidth: 600,
        marginRight:20
    },
    statisticContainer: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 20,
        width: 850,
        alignSelf: 'flex-end',
        marginRight:20,
        marginBottom:20
    },
    levelsContainer: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 20,
        width: 850,
        alignSelf: 'flex-end',
        marginRight:20
    },
    statisticSquare: {
        backgroundColor: Colors.coolGray,
        borderRadius: 12,
        padding: 20,
        width: 170,
        textAlign:'center',
        alignItems: 'center',
        margin:50,
    },
    avatarWrapper: {
        backgroundColor: Colors.triteWhite, // תואם לרקע שבתמונה שלך
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
        backgroundColor: Colors.grayish
    },
    avatarText: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop:20
    },
    subText: {
        color: Colors.darkGray,
        marginBottom: 20,
        fontSize:16
    },
    card: {
        backgroundColor: Colors.grayish,
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
    languageLabel:{
        fontSize: 16,
        padding: 5
    },
    countInput:  {
        color: Colors.black,
        fontSize: 24,
        fontWeight: "bold",
        marginRight: 5
    },
    countDescription:{ color: Colors.black, fontSize: 16 },
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
        backgroundColor: Colors.majorelleBlue,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: Colors.majorelleBlue,
    },
    profileSectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 50,
        color: Colors.majorelleBlue,
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
        backgroundColor: Colors.grayish,
        padding: 6,
        borderRadius: 6,
        marginLeft: 10,
    },
    lowerButtonText: {
        color: Colors.darkerDodgerBlue,
        fontWeight: '500',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
    },
    iconBox: {
        backgroundColor:Colors.triteWhite,
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
        width: 200,
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
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }


});
const statisticsStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    scrollView: {
        flexGrow: 1,
        minHeight: '100%', // חשוב כדי שיכסה תמיד את כל הגובה
        alignItems: 'center',
        padding: 24,
        width: wp(98),
        backgroundColor: Colors.background,
    },
    gradientTitleBox: {
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    cardContainer: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.black,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 30,
        width: '100%',
    },
    infoText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.darkGray,
        marginBottom: 6,
        textAlign: 'center',
    },
    topicCard: {
        padding: 20,
        borderRadius: 20,
        marginVertical: 8,
        alignItems: 'center',
        width: '100%',
        shadowColor: Colors.black,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    topicTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.secondary,
        marginBottom: 8,
    },
    topicStat: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.darkGray,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: Colors.secondary,
        textAlign: 'center',
    },
    backButton: {
        marginTop: 24,
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 100,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
const exercisePageStyles = StyleSheet.create({
    container: {
        padding: 24,
        paddingBottom: 60,
    },

    gradientQuestionBox: {
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 20,
        marginBottom: 24,
        width: '100%',
        shadowColor: Colors.black,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
    },


    title: {
        fontSize: 24,
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
    },

    answerButton: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#ede9fe",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        alignItems: 'center',
    },

    selectedAnswer: {
        backgroundColor: "#c4b5fd",
        transform: [{ scale: 1 }],
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center',
    },

    answerText: {
        fontSize: 18,
        textAlign: "center",
        color: Colors.darkGray,
        fontWeight: '600',
    },

    finishButton: {
        backgroundColor:Colors.lilac,
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
    },

    checkButton: {
        backgroundColor: Colors.lilac,
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
    },

    primaryText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    },

    secondaryButton: {
        backgroundColor: "#E5E7EB",
        padding: 14,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },

    secondaryText: {
        textAlign: "center",
        fontSize: 16,
    },

    feedback: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 10,
        fontWeight: "bold",
    },

    helpButton: {
        marginTop: 20,
        alignItems: "center",
    },


    explanation: {
        backgroundColor: "#f9fafb",
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center', // 💥 זה מה שחסר
    },


    explanationText: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
        color: Colors.darkGray,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    modalBox: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 12,
        width: "80%",
        alignItems: "center",
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },

    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },

    closeButton: {
        backgroundColor: "#4F46E5",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },

    correctAnswer: {
        backgroundColor: Colors.aeroBlue,
        borderColor: Colors.grassGreen,
        borderWidth: 2,
        borderRadius: 8,
        padding: 16,
        marginVertical: 6,
        alignItems: 'center',
    },

    incorrectAnswer: {
        backgroundColor: Colors.palePink,
        borderColor: Colors.redish,
        borderWidth: 2,
        borderRadius: 8,
        padding: 16,
        marginVertical: 6,
        alignItems: 'center',
    },

    nextButton: {
        backgroundColor: Colors.lilac,
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
        width: '100%',
        alignItems: 'center',
    },

    nextButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },

    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        color: Colors.darkGray,
        textAlign: 'center',

    },

    loading: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 18,
        color: Colors.secondary,
    },
    successIconBase: {
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: [{ translateX: -50 }], // חלק קבוע
        zIndex: 999,
    },
});
const homeButtonStyles = StyleSheet.create({
    buttonWrapper: {
        position: 'absolute',
        top: 30,
        left: 20,
        zIndex: 10,
    },
    gradient: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50, // פינות מאוד עגולות
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 180, // שומר על גודל מינימלי יפה
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: Colors.secondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});



export {authStyles,achievementsStyles,dashboardStyles,myCoursesStyles,
    myProfileStyles,statisticsStyles,exercisePageStyles, homeButtonStyles}

