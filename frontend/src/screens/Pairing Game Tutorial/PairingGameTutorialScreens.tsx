import React from 'react';
import { StyleSheet } from 'react-native';
import PairingGameTutorialScreen from './PairingGameTutorialScreen';
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { LIGHTPURPLE, TURQUOISE } from '../../constants/colors';
import Swiper from 'react-native-swiper';
import { User, UID } from "../../models/types";

interface PairingGameTutorialScreenProps {
    navigation: any;
    route: { params?: { signedIn?: boolean } }
}

const fi = new FirebaseInteractor();

export default function PairingGameTutorialScreens({ navigation, route: { params } }: PairingGameTutorialScreenProps) {

    const startSession = () => {
        fi.startSession().then((sessionId: UID) => navigation.navigate("GameScreen", {sessionId: sessionId}))
    }

    return (
        <Swiper
            showsButtons={false}
            loop={false}
            pagingEnabled={true}
            dotStyle={styles.dots}
            activeDotStyle={styles.activeDots}>
            <PairingGameTutorialScreen
                screenContent={
                    "Drag the English word into the box that matches with " +
                    "the Turkish word."} />
            <PairingGameTutorialScreen
                screenContent={
                    "You can change your answer by dragging the English " +
                    "word into a different box."} />
            <PairingGameTutorialScreen
                screenContent={
                    "Made a mistake? Tap the word to return it to the top."} />
            <PairingGameTutorialScreen
                screenContent={
                    "Once you have matched all the words, press done to " +
                    "submit your answers."} />
            <PairingGameTutorialScreen
                screenContent={
                    "Once you've submitted your answers, the game will " +
                    "give you your results.\n"}
                hasSecondaryScreenContent={true}
                secondaryScreenContent={
                    "Green means correct and red means incorrect."} />
            <PairingGameTutorialScreen
                screenContent={
                    `Click "play again" to restart the game or "end session" ` +
                    `to return to the home page.`} />                   
            <PairingGameTutorialScreen
                screenContent={
                    "Try the game out for yourself."}
                hasNavButton={true}
                navButtonTitle={"start session"}
                navigation={navigation}
                // Need to call the startSession() here to route to the pairing game screen
                route={"HomeScreen"} />
        </Swiper>
    )
}

const styles = StyleSheet.create({
    dots: {
        backgroundColor: LIGHTPURPLE,
        width: 16,
        height: 16,
        borderRadius: 16
    },
    activeDots: {
        backgroundColor: TURQUOISE,
        width: 16,
        height: 16,
        borderRadius: 16
    }
});
