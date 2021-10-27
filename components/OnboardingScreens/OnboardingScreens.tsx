import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackActions } from '@react-navigation/routers';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import OnboardingScreen from './OnboardingScreen';
import { TURQUOISE, BLUE, PURPLE } from '../../common/colors';

const Stack = createNativeStackNavigator();

export default function OnboardingScreens() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="First">
                <Stack.Screen name="First">
                    {props => 
                        <OnboardingScreen 
                            navigation={props.navigation} 
                            route="Second"
                            bgColor={BLUE}
                            screenContent="Thank you for agreeing to participate in our study! For the next week, your goal is to learn as many Turkish words as possible." 
                            screenImage="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/brain_1f9e0.png" />}
                </Stack.Screen>
                <Stack.Screen name="Second">
                    {props => 
                        <OnboardingScreen 
                            navigation={props.navigation} 
                            route="Third"
                            bgColor={TURQUOISE}
                            screenContent="To achieve your goal, you'll be using this app! Here is how it works: You'll see a set of English words and a set of Turkish words. You'll try to match each English word to the correct Turkish word, then you'll receive feedback. The more you practice, the better you'll get!" 
                            screenImage="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/trophy_1f3c6.png" />}
                </Stack.Screen>
                <Stack.Screen name="Third">
                    {props => 
                        <OnboardingScreen 
                            navigation={props.navigation} 
                            route="First"
                            bgColor={PURPLE}
                            screenContent="Over the next week, you can use this app to practice as much or as little as you like. At the end of the week, you'll receive a vocabulary test. The better you do on the test, the more money you'll win!" 
                            screenImage="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/money-with-wings_1f4b8.png" />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}