import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import styles from '../../styles/styles';

export default function Dashboard() {
    const router = useRouter();



    const handleLogout = () => {
        // כאן תוכל להוסיף את הלוגיקה של ההתנתקות
        // לאחר מכן, נווט לעמוד ה-login שלך
        router.push('/authentication/Login');     };

    return (
        <View style={{ flex: 1 }}>
            {/* סרגל ניווט */}
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        {/*<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>*/}
                        {/*    <MenuIcon />*/}
                        {/*</IconButton>*/}
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            HOME
                        </Typography>
                        <Box sx={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2
                        }}>
                            <Button color="inherit">play</Button>
                            <Button color="inherit">Statistic</Button>
                        </Box>
                        <ExitToAppIcon/>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>

                        {/* Empty right section for balance */}
                        <Box sx={{ flex: '0 1 auto' }} />
                    </Toolbar>
                </AppBar>
            </Box>

            {/* גוף הדף */}
            <View style={styles.container}>
                <Pressable onPress={() => router.navigate('/(tabs)/MyCourses')}>
                    <Text style={{ color: 'blue' }}>MyCourses</Text>
                </Pressable>
            </View>
        </View>
    );
}
