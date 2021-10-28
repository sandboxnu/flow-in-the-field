import React, { ReactElement } from 'react';
import { Modal, Image, StyleSheet, View, Text, Button, TouchableHighlight } from 'react-native';


interface OnboardingScreenProps {
    screenContent: string;
    bgColor: string;
    navigation: any;
    route: string;
}

export default function OnboardingScreen({
    screenContent, 
    bgColor,
    navigation,
    route}: OnboardingScreenProps): ReactElement {

    const backgroundStyle = {
        backgroundColor: bgColor
    };

    return (
        <TouchableHighlight style={styles.touchable} onPress={() => navigation.navigate(route)}>
            <View style={[styles.container, backgroundStyle]}>
                <Image style={styles.image} source={require('../../assets/flow-icon-light.png')}/>
                <Text style={styles.content}> {screenContent} </Text>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    touchable: {
        height: '100%'
    },
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