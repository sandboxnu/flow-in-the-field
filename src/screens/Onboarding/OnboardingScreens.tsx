import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import LoginPage from '../Login/login';
import SignInFlow from '../Login/signInFlow';
import OnboardingScreen from './OnboardingScreen';
import FinalOnboardingScreen from './FinalOnboardingScreen';
import { TURQUOISE, BLUE, PURPLE } from '../../constants/colors';
import Swiper from 'react-native-swiper';

interface OnboardingScreenProps {
    navigation: any;
}

export default function OnboardingScreens({ navigation }: OnboardingScreenProps) {
    return (
        <Swiper 
            showsButtons={false} 
            loop={false} 
            pagingEnabled={true}
            dotStyle={{backgroundColor:'rgba(255,255,255,0.5)', width: 16, height: 16, borderRadius: 16}}
            activeDotStyle={{backgroundColor:'#FFF', width: 16, height: 16, borderRadius: 16}}>
            <OnboardingScreen 
                bgColor={BLUE}
                screenContent={
                    "Thank you for agreeing to \nparticipate in our study! " +
                    "For the next week, your goal is to learn as many " +
                    "Turkish words as possible."
                }/>
            <OnboardingScreen 
                bgColor={TURQUOISE}
                screenContent={
                    "To achieve your goal, you'll be using this app!\n\n " +
                    "Here is how it works:\n • You'll see a set of English " +
                    "words and a set of Turkish words.\n • You'll try to " +
                    "match each English word to the correct Turkish word, " +
                    "then you'll receive feedback.\n • The more you practice, " +
                    "the better you'll get!"
                }/>
            <FinalOnboardingScreen 
                bgColor={PURPLE}
                navigation={navigation}
                screenContent={
                    "Over the next week, you can use this app to practice " +
                    "as much or as little as you like. At the end of the week, " +
                    "you'll receive a vocabulary test. The better you do on the " +
                    "test, the more money you'll win!"
                }/>
        </Swiper>
    )
}
