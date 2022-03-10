import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import GameTutorialScreen from './GameTutorialScreen';
import { LIGHTPURPLE, TURQUOISE } from '../../constants/colors';
import Swiper from 'react-native-swiper';

// Images to display on pairing and selecting tutorial pages
const tutorialImages = {
	page1: require('../../assets/tutorial-page-1.png'),
	page2: require('../../assets/tutorial-page-2.png'),
	page3: require('../../assets/tutorial-page-3.png'),
    page4: require('../../assets/tutorial-page-4.png'),
    page5Pairing: require('../../assets/pairing-tutorial-page-5.png'),
    page5Selecting: require('../../assets/selecting-tutorial-page-5.png'),
    page6: require('../../assets/tutorial-page-6.png'),
};

interface GameTutorialScreenProps {
    isPairing: boolean;
    onFinish: Function;
}

export default function GameTutorialScreens({
    isPairing,
    onFinish,
}: GameTutorialScreenProps): ReactElement {

    return (
        <Swiper
            showsButtons={false}
            loop={false}
            pagingEnabled={true}
            dotStyle={styles.dots}
            activeDotStyle={styles.activeDots}>
            <GameTutorialScreen
                screenContent={
                    "Drag the English word into the box that matches with " +
                    "the Turkish word."}
                imagePath={tutorialImages.page1}
                onFinish={onFinish}/>
            <GameTutorialScreen
                screenContent={
                    "You can change your answer by dragging the English " +
                    "word into a different box."}
                imagePath={tutorialImages.page2}
                onFinish={onFinish}/>
            <GameTutorialScreen
                screenContent={
                    "Made a mistake? Tap the word to return it to the top."}
                imagePath={tutorialImages.page3}
                onFinish={onFinish}/>
            <GameTutorialScreen
                screenContent={
                    "Once you have matched all the words, press done to " +
                    "submit your answers."}
                imagePath={tutorialImages.page4}
                onFinish={onFinish}/>
            <GameTutorialScreen
                screenContent={
                    "Once you've submitted your answers, the game will " +
                    "give you your results.\n"}
                secondaryScreenContent={isPairing ? 
                    "Green means correct and red means incorrect." :
                    "Green means correct and red means incorrect. Words" + 
                    "that were unmatched remain blue."}
                imagePath={isPairing ? tutorialImages.page5Pairing : tutorialImages.page5Selecting}
                onFinish={onFinish}/>
            <GameTutorialScreen
                screenContent={
                    `Click "play again" to restart the game or "end session" ` +
                    `to return to the home page.`}
                imagePath={tutorialImages.page6}
                onFinish={onFinish}/>                   
            <GameTutorialScreen
                screenContent={
                    "Try the game out for yourself."}
                hasNavButton={true}
                navButtonTitle={"start session"}
                onFinish={onFinish}/>
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
