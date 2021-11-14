import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { initializeApp } from "firebase/app";
import OnboardingScreens from './src/screens/Onboarding/OnboardingScreens';
import signInFlow from './src/screens/Login/signInFlow';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Homescreen from './src/screens/homescreen';
import AccountSettings from './src/screens/Login/accountSettings';
import PairingGameScreen from './src/screens/pairingGameScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator()
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Onboarding" component={OnboardingScreens} options={{ headerShown: false }} />
        <Stack.Screen name="SignInFlow" component={signInFlow} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="drawer" component={drawerScreen} options={{ headerShown: false, gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function drawerScreen() {
  return (
    <Drawer.Navigator screenOptions={{ headerTintColor: "#D16B50", headerTitle: () => { return <Image source={require("./src/assets/flow-icon.png")} style={styles.mainImage} /> } }}>
      <Drawer.Screen name="home" component={Homescreen} />
      <Drawer.Screen name="settings" component={AccountSettings} />
      <Drawer.Screen name="pairingGame" component={PairingGameScreen} />
    </Drawer.Navigator>);
}

const styles = StyleSheet.create({
  mainImage: {
    width: 94,
    resizeMode: 'contain',
    height: 51
  }
});
