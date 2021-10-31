import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initializeApp } from "firebase/app";
import OnboardingScreens from './components/OnboardingScreens/OnboardingScreens';
import LoginPage from './screens/login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Onboarding" component={OnboardingScreens} options={{headerShown: false}}/>
        <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
