import React, { ReactElement, useCallback } from 'react';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/core";
import { ORANGE, LIGHTPURPLE } from '../../constants/colors';
import FirebaseInteractor from "../../firebase/firebaseInteractor";

const fi = new FirebaseInteractor();

interface GameTutorialScreenProps {
    screenContent: string;
    secondaryScreenContent?: string;
    imagePath?: Object;
    hasNavButton?: boolean;
    navButtonTitle?: string;
    isPairing?: boolean;
    onFinish: Function;
}

export default function GameTutorialScreen({
    screenContent,
    secondaryScreenContent,
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
                <Text style={styles.startPlaying}>Let's Start Playing!</Text>}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>         
                {!hasNavButton &&
                    <Text style={styles.howToPlay}>How to Play</Text>}
                {!hasNavButton &&
                    <Pressable onPress={handleTutorialFinish}>
                        <Text style={styles.skip}>Skip</Text>
                    </Pressable>}
            </View>
            <View style={{ width: "95%" }}>
                {/* Places screen content for all but last page */}
                {!hasNavButton && 
                    <Text style={!secondaryScreenContent ? 
                        styles.content : 
                        {...styles.content, marginBottom: 0}}>{ screenContent }</Text>}
                {/* Places secondary screen (lower) content for all pages that have it */}
                {secondaryScreenContent &&
                    <Text style={{...styles.content, color: LIGHTPURPLE, marginBottom: 20, marginLeft: 0, marginRight: 0}}>{ secondaryScreenContent }</Text>}
            </View>
            {/* Places image for all pages that have it (all but final page) */}
            {imagePath &&
                <Image style={styles.image} source={imagePath}/>}
            {/* Places screen content for final page */}
            {hasNavButton &&
                    <Text style={styles.content}>{ screenContent }</Text>} 
            {/* Button to start session at end of tutorial */}
            {hasNavButton &&
                <Pressable onPress={handleTutorialFinish} style={styles.button}>
                    <Text style={styles.buttonContent}>{ navButtonTitle }</Text>
                </Pressable>}
        </View>
    )
}

// const styles = StyleSheet.create({
//     container: {
//         // flex: 1,
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'flex-start',
//         backgroundColor: '#FFF',
//         paddingLeft: "6%",
//         paddingRight: "6%",
//     },
//     imageContainer: {
//         // flex: 0,
//         // marginTop: "10%",
//         // justifyContent: 'center',
//         // alignItems: 'center',
//         height: "70%"
//     },
//     image: {
//         // position: 'absolute',
//         // height: "20%",
//         flex: 0,
//         maxHeight: "25%",
//         width: '90%',
//         // marginTop: "15%",
//         // padding: "22%",
//         resizeMode: 'contain',
//         // marginBottom: "8%",
//     },
//     contentView: {
//         flex: 1
//     },
//     secondaryContentView: {
//         flex: 1.5
//     },
//     content: {
//         fontFamily: 'Avenir Next',
//         fontWeight: '500',
//         fontSize: 18,
//         // marginBottom: "15%",
//         color: '#000000',
//         textAlign: 'left'
//     },
//     button: {
//         // flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: ORANGE,
//         width: "38%",
//         maxHeight: "6%",
//         marginTop: "7%",
//         borderRadius: 8,
//         overflow: 'hidden'
//     },
//     buttonContent: {
//         backgroundColor: ORANGE,
//         fontFamily: 'Futura',
//         fontSize: 20,
//         color: '#FFF',
//     },
//     howToPlay: {
//         fontSize: 24,
//         fontWeight: "bold",
//         color: "#5EAFDF",
//         paddingTop: "3%",
//         paddingBottom: "10%",
//         marginRight: "46%",
//     },
//     skip: {
//         fontSize: 18,
//         color: "#979797",
//         paddingTop: "3%",
//         paddingBottom: "10%",
//     },
//     startPlaying: {
//         fontSize: 24,
//         fontWeight: "bold",
//         color: "#5EAFDF",
//         paddingTop: "4%",
//         paddingBottom: "10%",
//         textAlign: "center",
//     }
// });

// old styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingLeft: "6%",
        paddingRight: "6%",
    },
    image: {
        height: "20%",
        width: '90%',
        padding: "22%",
        resizeMode: 'contain',
        marginBottom: "8%",
    },
    content: {
        fontFamily: 'Avenir Next',
        fontWeight: '500',
        fontSize: 18,
        marginBottom: "15%",
        color: '#000000',
        textAlign: 'left'
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ORANGE,
        width: "38%",
        maxHeight: "6%",
        marginTop: "7%",
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
