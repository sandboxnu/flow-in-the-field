import React, { ReactElement } from 'react';
import { Image, StyleSheet, View, Text, TouchableHighlight } from 'react-native';


interface OnboardingScreenProps {
    screenContent: string;
    bgColor: string;
}

export default function OnboardingScreen({
    screenContent, 
    bgColor}: OnboardingScreenProps): ReactElement {

    const backgroundStyle = {
        backgroundColor: bgColor
    };

    return (
        <TouchableHighlight style={styles.touchable}>
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
        textAlign: 'center'
    }
});