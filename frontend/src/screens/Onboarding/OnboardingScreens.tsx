import React from 'react';
import { StyleSheet } from 'react-native';
import OnboardingScreen from './OnboardingScreen';
import { TURQUOISE, BLUE, PURPLE } from '../../constants/colors';
import Swiper from 'react-native-swiper';

interface OnboardingScreenProps {
    navigation: any;
    route: { params?: { signedIn?: boolean } }
}

export default function OnboardingScreens({ navigation, route: { params } }: OnboardingScreenProps) {
    return (
        <Swiper
            showsButtons={false}
            loop={false}
            pagingEnabled={true}
            dotStyle={styles.dots}
            activeDotStyle={styles.activeDots}>
            <OnboardingScreen
                bgColor={BLUE}
                screenContent={
                    "Thank you for agreeing to \nparticipate in our study! " +
                    "For the next week, your goal is to learn as many " +
                    "Turkish words as possible."} />
            <OnboardingScreen
                bgColor={TURQUOISE}
                screenContent={
                    "To achieve your goal, you'll be using this app!\n\n " +
                    "Here is how it works:\n • You'll see a set of English " +
                    "words and a set of Turkish words.\n • You'll try to " +
                    "match each English word to the correct Turkish word, " +
                    "then you'll receive feedback.\n • The more you practice, " +
                    "the better you'll get!"} />
            <OnboardingScreen
                bgColor={PURPLE}
                screenContent={
                    "Over the next week, you can use this app to practice " +
                    "as much or as little as you like. At the end of the week, " +
                    "you'll receive a vocabulary test. The better you do on the " +
                    "test, the more money you'll win!"}
                hasNavButton={true}
                navButtonTitle={params?.signedIn ? "done" : "register"}
                navigation={navigation}
                route={params?.signedIn ? "HomeScreen" : "SignInFlow"} />
        </Swiper>
    )
}

const styles = StyleSheet.create({
    dots: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        width: 16,
        height: 16,
        borderRadius: 16
    },
    activeDots: {
        backgroundColor: '#FFF',
        width: 16,
        height: 16,
        borderRadius: 16
    }
});
