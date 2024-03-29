import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Image, Text } from "react-native";

import BackButton from "./src/components/Button/BackButton";
import FirebaseInteractor from "./src/firebase/firebaseInteractor";
import { UID } from "./src/models/types";
import ConsentScreen from "./src/screens/ConsentScreen";
import GameScreenFlow from "./src/screens/GameScreen/GameScreenFlow";
import ChangePasswordScreen from "./src/screens/Login/changePassword";
import SettingsScreen from "./src/screens/Login/settings";
import signInFlow from "./src/screens/Login/signInFlow";
import OnboardingScreens from "./src/screens/Onboarding/OnboardingScreens";
import TestResultsScreen from "./src/screens/TestScreen/TestResultsScreen";
import TestScreen from "./src/screens/TestScreen/TestScreen";
import TestWelcomeScreen from "./src/screens/TestScreen/TestWelcomeScreen";
import AdminScreen from "./src/screens/adminScreen";
import EmailVerificationScreen from "./src/screens/emailVerificationScreen";
import Homescreen from "./src/screens/homescreen";
import { GameStateContext } from "./src/utils/context";

const Stack = createNativeStackNavigator();
export default function App() {
  const HOME_HEADER_OPTIONS = {
    headerTitle: () => {
      return (
        <Image
          style={styles.mainImage}
          source={require("./src/assets/flow-icon.png")}
        />
      );
    },
    title: "",
    headerTitleAlign: "center" as "center",
    headerShadowVisible: false,
    headerTintColor: "#D16B50",
    headerBackTitle: "",
    headerStyle: {
      backgroundColor: "#FFF",
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
  };

  const NAV_THEME = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#FFF",
    },
  };

  const [currentRoundId, setCurrentRoundId] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState("");
  const fi = new FirebaseInteractor();

  function onRoundChange(newRoundId: UID) {
    setCurrentRoundId(newRoundId);
  }

  function onSessionChange(newSessionId: UID) {
    setCurrentSessionId(newSessionId);
  }

  return (
    <GameStateContext.Provider
      value={{
        sessionId: currentSessionId,
        roundId: currentRoundId,
        updateRoundId: onRoundChange,
        updateSessionId: onSessionChange,
      }}
    >
      <NavigationContainer theme={NAV_THEME}>
        <Stack.Navigator
          screenOptions={HOME_HEADER_OPTIONS}
          initialRouteName="SignInFlow"
        >
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreens}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignInFlow"
            component={signInFlow}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="ConsentScreen"
            component={ConsentScreen}
            options={{ headerBackVisible: false }}
          />
          <Stack.Screen
            name="EmailVerification"
            component={EmailVerificationScreen}
            options={{
              headerShown: false,
              gestureEnabled: false,
              animation: "none",
            }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={Homescreen}
            options={{ gestureEnabled: false, headerBackVisible: false }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{
              headerTitle: () => (
                <Text style={{ color: "#5eafdf", fontSize: 20 }}>Settings</Text>
              ),
              headerLeft: () => <BackButton onPress={() => {}} />,
              headerShadowVisible: true,
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="ChangePasswordScreen"
            component={ChangePasswordScreen}
            options={{
              headerTitle: () => (
                <Text style={{ color: "#5eafdf", fontSize: 20 }}>Settings</Text>
              ),
              headerLeft: () => (
                <BackButton onPress={() => {}} isHome={false} />
              ),
              headerShadowVisible: true,
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="GameScreen"
            component={GameScreenFlow}
            options={{
              headerTitle: () => {
                return (
                  <Text style={{ color: "#5eafdf", fontSize: 20 }}>
                    Vocabulary Practice
                  </Text>
                );
              },
              headerTintColor: "#000",
              headerLeft: () => (
                <BackButton
                  onPress={async () => {
                    const currentWords = await fi.getCorrectWords(
                      currentRoundId
                    );
                    fi.endRound(currentRoundId, currentWords);
                    fi.endSession(currentSessionId);
                    onRoundChange("");
                    onSessionChange("");
                  }}
                />
              ),
              headerShadowVisible: true,
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="AdminScreen"
            component={AdminScreen}
            options={{
              headerTitle: () => (
                <Text style={{ color: "#5eafdf", fontSize: 20 }}>Admin</Text>
              ),
              headerLeft: () => <BackButton onPress={() => {}} />,
              headerShadowVisible: true,
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="TestWelcomeScreen"
            component={TestWelcomeScreen}
            options={{
              headerLeft: () => (
                <BackButton onPress={() => {}} tint="#FFFFFF" />
              ),
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="TestScreen"
            component={TestScreen}
            options={{ headerBackVisible: false }}
          />
          <Stack.Screen
            name="TestResultsScreen"
            component={TestResultsScreen}
            options={{ headerBackVisible: false }}
          />
          <Stack.Screen
            name="RevisitOnboarding"
            component={OnboardingScreens}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameStateContext.Provider>
  );
}

const styles = StyleSheet.create({
  mainImage: {
    width: 94,
    resizeMode: "contain",
    height: 51,
  },
});
