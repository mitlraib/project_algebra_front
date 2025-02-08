
import React, { useState } from 'react';
import {Text, View, TextInput, StyleSheet, StatusBar, Platform, Image, Pressable, Button} from 'react-native';
import { useRouter } from 'expo-router';
import { Sizes, Spacing } from '../../constants/Sizes';
import styles from '../../styles/styles';
import axios from "axios"; // ייבוא הסטיילים

const MyCourses = () => {
    const router = useRouter();


    return (
        <View style={styles.container}>
            <Text>MyCourses</Text>
            <Pressable onClick={() => router.navigate('/(tabs)/MyCourses')}>
                MyCourses
            </Pressable>

        </View>
    )

};
export default MyCourses;