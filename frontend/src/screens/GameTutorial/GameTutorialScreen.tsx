import React, { ReactElement, useCallback } from 'react';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/core";
import { LIGHTPURPLE } from '../../constants/colors';
import FirebaseInteractor from "../../firebase/firebaseInteractor";

const fi = new FirebaseInteractor();

interface GameTutorialScreenProps {
    screenContent: string;
    secondaryScreenContent?: string;
    doneButton?: boolean;
    imagePath?: Object;
    hasNavButton?: boolean;
    navButtonTitle?: string;
    isPairing?: boolean;
    onFinish: Function;
}

export default function GameTutorialScreen({
    screenContent,
    secondaryScreenContent,
    doneButton,
    imagePath,
    hasNavButton,
    navButtonTitle,
    onFinish,
}: GameTutorialScreenProps): ReactElement {

    const navigation = useNavigation();

    const handleTutorialFinish = useCallback(event => {
        onFinish(true);
        fi.updateHasFinishedTutorial();
    }, [onFinish])

    return (
        <View style={ styles.container }>
            {hasNavButton &&
                <View>
                    <Text style={styles.startPlaying}>Let's Start Playing!</Text>
                </View>}

            {!hasNavButton &&
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>         
                    <Text style={styles.howToPlay}>How to Play</Text>
                    <Pressable onPress={handleTutorialFinish}>
                        <Text style={styles.skip}>Skip</Text>
                    </Pressable>
                </View>}
            
            <View style={styles.contentContainer}>
                <View style={{ width: "95%" }}>
                    {/* Places screen content for all but last page */}
                    {!hasNavButton && 
                        <Text style={!secondaryScreenContent ? 
                            styles.content : 
                            {...styles.content, marginBottom: 0}}>{ screenContent }</Text>}
                    {/* Places secondary screen (lower) content for all pages that have it */}
                    {secondaryScreenContent &&
                        <Text style={{...styles.content, color: LIGHTPURPLE, marginBottom: 20, marginLeft: 0, marginRight: 0}}>{ secondaryScreenContent }</Text>}
                    {/* Places screen content for final page */}
                    {hasNavButton &&
                            <Text style={{...styles.content, textAlign: 'center'}}>{ screenContent }</Text>} 
                </View>
            </View>

            <View style={styles.imageAndButtonContainer}>
                {/* Places image for all pages that have it (all but final page) */}
                {imagePath &&
                    <Image style={styles.image} source={imagePath}/>}
                {/* Places done button (no behavior on press) on page */}
                {doneButton &&
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonContent}>{ "done" }</Text>
                    </Pressable>}
                {/* Button to start session at end of tutorial */}
                {hasNavButton &&
                    <Pressable onPress={handleTutorialFinish} style={styles.button}>
                        <Text style={styles.buttonContent}>{ navButtonTitle }</Text>
                    </Pressable>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingLeft: "6%",
        paddingRight: "6%",
    },
    contentContainer: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: "100%",
        marginTop: "5%",
    },
    imageAndButtonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginBottom: "20%"
    },
    image: {
        height: "20%",
        width: '85%',
        padding: "22%",
        resizeMode: 'contain',
    },
    content: {
        fontFamily: 'Avenir Next',
        fontWeight: '500',
        fontSize: 18,
        color: '#000000',
        textAlign: 'left'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: LIGHTPURPLE,
        width: "42%",
        height: "11%",
        borderRadius: 8,
        overflow: 'hidden'
    },
    buttonContent: {
        backgroundColor: LIGHTPURPLE,
        fontFamily: 'Futura',
        fontSize: 20,
        color: '#FFF',
    },
    howToPlay: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#5EAFDF",
        paddingTop: "3%",
        paddingBottom: "10%",
        marginRight: "46%",
    },
    skip: {
        fontSize: 18,
        color: "#979797",
        paddingTop: "3%",
        paddingBottom: "10%",
    },
    startPlaying: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#5EAFDF",
        paddingTop: "4%",
        paddingBottom: "10%",
        textAlign: "center",
    }
});
