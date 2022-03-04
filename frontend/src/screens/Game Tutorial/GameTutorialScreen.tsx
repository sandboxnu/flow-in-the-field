import React, { ReactElement, useCallback } from 'react';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/core";
import { ORANGE, LIGHTPURPLE } from '../../constants/colors';
import FirebaseInteractor from "../../firebase/firebaseInteractor";

const fi = new FirebaseInteractor();

interface GameTutorialScreenProps {
    screenContent: string;
    secondaryScreenContentPairing?: string;
    secondaryScreenContentSelecting?: string;
    imagePath?: Object;
    imagePathSelecting?: Object;
    hasNavButton?: boolean;
    navButtonTitle?: string;
    isPairing?: boolean;
    onFinish: Function;
}

export default function GameTutorialScreen({
    screenContent,
    secondaryScreenContentPairing,
    secondaryScreenContentSelecting,
    imagePath,
    imagePathSelecting,
    hasNavButton,
    navButtonTitle,
    isPairing,
    onFinish
}: GameTutorialScreenProps): ReactElement {

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
            {isPairing && !secondaryScreenContentPairing &&
                <Text style={styles.content}>{ screenContent }</Text>}
            {!isPairing && !secondaryScreenContentSelecting &&
                <Text style={styles.content}>{ screenContent }</Text>}         
            {isPairing && secondaryScreenContentPairing &&
                <Text style={{...styles.content, marginBottom: 0}}>{ screenContent }</Text>}
            {!isPairing && secondaryScreenContentSelecting &&
                <Text style={{...styles.content, marginBottom: -5}}>{ screenContent }</Text>}
            {isPairing && secondaryScreenContentPairing &&
                <Text style={{...styles.content, color: LIGHTPURPLE, marginBottom: 20, marginLeft: -20, marginRight: 20}}>{ secondaryScreenContentPairing }</Text>}
            {!isPairing && secondaryScreenContentSelecting &&
                <Text style={{...styles.content, color: LIGHTPURPLE, marginBottom: 20, marginLeft: -25}}>{ secondaryScreenContentSelecting }</Text>}
            {isPairing && imagePath &&
                <Image style={styles.image} source={imagePath}/>}
            {!isPairing && imagePathSelecting &&
                <Image style={styles.image} source={imagePathSelecting}/>}
            {hasNavButton &&
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