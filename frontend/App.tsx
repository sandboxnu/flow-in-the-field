import React, { useCallback, useEffect, useState } from 'react';
import { User, Word, UID, GameType } from "./src/models/types";
import { StyleSheet, Text, View, Image, ViewStyle } from 'react-native';
import { initializeApp } from "firebase/app";
import OnboardingScreens from './src/screens/Onboarding/OnboardingScreens';
import signInFlow from './src/screens/Login/signInFlow';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homescreen from './src/screens/homescreen';
import AccountSettings from './src/screens/Login/accountSettings';
import PairingGameScreen from "./src/screens/pairingGameScreen";
import { GameScreenProps } from "./src/screens/pairingGameScreen"
import EmailVerificationScreen from './src/screens/emailVerificationScreen';
import { HAS_SEEN_ONBOARDING } from './src/constants/startingStates';
import AsyncStorage from "@react-native-async-storage/async-storage"
import FirebaseInteractor from "./src/firebase/firebaseInteractor";
import SelectingGameScreen from "./src/screens/selectingGameScreen";
import GameScreenFlow from "./src/screens/GameScreenFlow";
import TestScreen from "./src/screens/TestScreen";

const Stack = createNativeStackNavigator();
export default function App() {

  const HOME_HEADER_OPTIONS = {
    headerTitle: () => { return <Image style={styles.mainImage} source={require('./src/assets/flow-icon.png')} /> },
    title: '',
    headerTitleAlign: "center" as "center",
    headerShadowVisible: false,
    headerTintColor: '#D16B50',
    headerBackTitle: '',
    headerStyle: {
      backgroundColor: '#FFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    }
  }

  const NAV_THEME = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FFF'
    },
  };

  const [startingState, setStartingState] = useState<string>();


  useEffect(() => {
    AsyncStorage.getItem(HAS_SEEN_ONBOARDING).then(val => setStartingState(val ? "SignInFlow" : "Onboarding"));
  }, [])
  if (!startingState) {
    return null;
  } else {
    return (
      <NavigationContainer theme={NAV_THEME}>
        <Stack.Navigator screenOptions={HOME_HEADER_OPTIONS} initialRouteName={startingState}>
          <Stack.Screen name="Onboarding" component={OnboardingScreens} options={{ headerShown: false }} />
          <Stack.Screen name="SignInFlow" component={signInFlow} options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} options={{ headerShown: false, gestureEnabled: false, animation: "none" }} />
          <Stack.Screen name="HomeScreen" component={Homescreen} options={{ gestureEnabled: false, headerBackVisible: false }} />
          <Stack.Screen name="SettingsScreen" component={AccountSettings} />
          <Stack.Screen name="GameScreen" component={GameScreenFlow} />
          <Stack.Screen name="TestScreen" component={TestScreen} />
          <Stack.Screen name="RevisitOnboarding" component={OnboardingScreens} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  mainImage: {
    width: 94,
    resizeMode: 'contain',
    height: 51
  }
});
