import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackActions } from '@react-navigation/routers';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import OnboardingScreen from './OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingScreens() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="First"
                    component={OnboardingScreen}
                    initialParams={{ screenContent: "hey there", screenHeader: "Hey", screenImage: "https://reactnative.dev/img/tiny_logo.png" }}/>
            </Stack.Navigator>
            <Stack.Navigator>
                <Stack.Screen
                    name="Second"
                    component={OnboardingScreen}
                    initialParams={{ screenContent: "bye there", screenHeader: "Bye", screenImage: "https://reactnative.dev/img/tiny_logo.png" }}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}