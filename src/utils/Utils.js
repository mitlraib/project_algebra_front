import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {homeButtonStyles} from '../../styles/styles'

export function HomeButton() {
    const router = useRouter();

    return (
        <Pressable onPress={() => router.push('/Dashboard')} style={homeButtonStyles.buttonWrapper}>
            <LinearGradient
                colors={['#ede9fe', '#c4b5fd']} // מעבר של סגול בהיר
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={homeButtonStyles.gradient}
            >
                <Text style={homeButtonStyles.buttonText}>🏠 חזרה לדף הבית</Text>
            </LinearGradient>
        </Pressable>
    );
}

