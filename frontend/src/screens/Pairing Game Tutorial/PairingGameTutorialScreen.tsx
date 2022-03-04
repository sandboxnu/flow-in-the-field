import React, { ReactElement, useCallback, useMemo, useRef } from 'react';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/core";
import { ORANGE, LIGHTPURPLE } from '../../constants/colors';
import FirebaseInteractor from "../../firebase/firebaseInteractor";

const fi = new FirebaseInteractor();

interface PairingGameTutorialScreenProps {
    screenContent: string;
    secondaryScreenContent?: string;
    imagePath?: Object;
    hasNavButton?: boolean;
    navButtonTitle?: string;
    route?: string;
    onFinish: Function;
}

export default function PairingGameTutorialScreen({
    screenContent,
    secondaryScreenContent,
    imagePath,
    hasNavButton,
    navButtonTitle,
    route,
    onFinish
}: PairingGameTutorialScreenProps): ReactElement {

    const navigation = useNavigation();

    const handleTutorialFinish = useCallback(event => {
        onFinish(true);
        fi.updateHasFinishedTutorial();
    }, [onFinish])

    return (
        <View style={ styles.container }>
            {hasNavButton &&
                <Text style={styles.startPlaying}>Let's Start Playing!</Text>}
            {!hasNavButton &&
                <Text style={styles.howToPlay}>How to Play</Text>}
            {!secondaryScreenContent &&
                <Text style={styles.content}>{ screenContent }</Text>}
            {secondaryScreenContent &&
                <Text style={{...styles.content, marginBottom: 0}}>{ screenContent }</Text>}
            {secondaryScreenContent &&
                <Text style={{...styles.content, color: LIGHTPURPLE}}>{ secondaryScreenContent }</Text>}
            {imagePath &&
                <Image style={styles.image} source={imagePath}/>}
            {hasNavButton && route &&
                // <Pressable onPress={() => {fi.updateHasFinishedTutorial()}} style={styles.button}>
                <Pressable onPress={handleTutorialFinish} style={styles.button}>
                    <Text style={styles.buttonContent}>{ navButtonTitle }</Text>
                </Pressable>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingLeft: 20,
        paddingRight: 20,
    },
    image: {
        height: 64,
        width: '100%',
        padding: 80,
        resizeMode: 'contain',
        marginBottom: 24
    },
    content: {
        fontFamily: 'Avenir Next',
        fontWeight: '500',
        fontSize: 18,
        marginBottom: 50,
        color: '#000000',
        textAlign: 'left'
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ORANGE,
        width: 130,
        maxHeight: 30,
        marginTop: 32,
        borderRadius: 8,
        overflow: 'hidden'
    },
    buttonContent: {
        backgroundColor: ORANGE,
        fontFamily: 'Futura',
        fontSize: 20,
        color: '#FFF',
    },
    howToPlay: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#5EAFDF",
        paddingTop: 12,
        paddingBottom: 32,
        textAlign: "center",
    },
    startPlaying: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#5EAFDF",
        paddingTop: 12,
        paddingBottom: 32,
        textAlign: "center",
    }
});
