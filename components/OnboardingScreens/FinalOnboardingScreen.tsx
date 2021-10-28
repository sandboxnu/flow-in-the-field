import React, { ReactElement } from 'react';
import { Modal, Image, StyleSheet, View, Text, Button, TouchableHighlight } from 'react-native';

interface FinalOnboardingScreenProps {
    navigation: any,
    route: string,
    screenContent: string;
    bgColor: string;
}

export default function FinalOnboardingScreen({
    navigation,
    route,
    screenContent, 
    bgColor}: FinalOnboardingScreenProps): ReactElement {

    const backgroundStyle = {
        backgroundColor: bgColor
    };

    return (
        <View style={[styles.container, backgroundStyle]}>
            <Image style={styles.image} source={require('../../assets/flow-icon-light.png')}/>
            <Text style={styles.content}> {screenContent} </Text>
            <Button title="Press" onPress={() => navigation.navigate(route)}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
    image: {
        height: 95,
        maxHeight: 158,
        width: '100%',
        resizeMode: 'contain'
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16
    },
    content: {
        fontSize: 14,
        margin: 16,
        color: '#FFF'
    },
    button: {
        
    }
});