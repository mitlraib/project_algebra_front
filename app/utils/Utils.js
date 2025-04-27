import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export function HomeButton() {
    const router = useRouter();

    return (
        <Pressable onPress={() => router.push('/Dashboard')} style={styles.buttonWrapper}>
            <LinearGradient
                colors={['#ede9fe', '#c4b5fd']} // מעבר של סגול בהיר
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={styles.gradient}
            >
                <Text style={styles.buttonText}>🏠 חזרה לדף הבית</Text>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: '#5b21b6', // סגול כהה לטקסט
        fontSize: 16,
        fontWeight: 'bold',
    },
});
