import React, { ReactElement } from 'react';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';

interface FinalOnboardingScreenProps {
    navigation: any;
    screenContent: string;
    bgColor: string;
}

export default function FinalOnboardingScreen({
    navigation,
    screenContent, 
    bgColor}: FinalOnboardingScreenProps): ReactElement {

    const backgroundStyle = {
        backgroundColor: bgColor
    };

    return (
        <View style={[styles.container, backgroundStyle]}>
            <Image style={styles.image} source={require('../../assets/flow-icon-light.png')}/>
            <Text style={styles.content}> {screenContent} </Text>
            <Pressable onPress={() => {navigation.navigate('Login')}} style={styles.button}>
                <Text style={styles.buttonContent}>Register</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingLeft: 48,
        paddingRight: 48,
        paddingTop: '50%',
    },
    image: {
        height: 64,
        width: '100%',
        resizeMode: 'contain',
        marginBottom: 24
    },
    content: {
        fontFamily: 'Futura',
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 24
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        width: 130,
        maxHeight: 30,
        borderRadius: 8,
        overflow: 'hidden'
    },
    buttonContent: {
        backgroundColor: '#FFF'
    }
});