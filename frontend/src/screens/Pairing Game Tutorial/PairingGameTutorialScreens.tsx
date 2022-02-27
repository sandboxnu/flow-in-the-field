import React from 'react';
import { StyleSheet } from 'react-native';
import PairingGameTutorialScreen from './PairingGameTutorialScreen';
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { LIGHTPURPLE, TURQUOISE } from '../../constants/colors';
import Swiper from 'react-native-swiper';
import { User, UID } from "../../models/types";

const pairingTutorialImages = {
	page1: require('../../assets/pairing-tutorial-page-1.png'),
	page2: require('../../assets/pairing-tutorial-page-2.png'),
	page3: require('../../assets/pairing-tutorial-page-3.png'),
    page4: require('../../assets/pairing-tutorial-page-4.png'),
    page5: require('../../assets/pairing-tutorial-page-5.png'),
    page6: require('../../assets/pairing-tutorial-page-6.png'),
};

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
                    "the Turkish word."}
                imagePath={pairingTutorialImages.page1}/>
            <PairingGameTutorialScreen
                screenContent={
                    "You can change your answer by dragging the English " +
                    "word into a different box."}
                imagePath={pairingTutorialImages.page2}/>
            <PairingGameTutorialScreen
                screenContent={
                    "Made a mistake? Tap the word to return it to the top."}
                imagePath={pairingTutorialImages.page3}/>
            <PairingGameTutorialScreen
                screenContent={
                    "Once you have matched all the words, press done to " +
                    "submit your answers."}
                imagePath={pairingTutorialImages.page4}/>
            <PairingGameTutorialScreen
                screenContent={
                    "Once you've submitted your answers, the game will " +
                    "give you your results.\n"}
                secondaryScreenContent={
                    "Green means correct and red means incorrect."}
                imagePath={pairingTutorialImages.page5}/>
            <PairingGameTutorialScreen
                screenContent={
                    `Click "play again" to restart the game or "end session" ` +
                    `to return to the home page.`}
                imagePath={pairingTutorialImages.page6}/>                   
            <PairingGameTutorialScreen
                screenContent={
                    "Try the game out for yourself."}
                hasNavButton={true}
                navButtonTitle={"start session"}
                navigation={navigation}
                // TO DO: Need to call the startSession() here to route to the pairing game screen
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
