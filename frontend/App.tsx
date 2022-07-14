import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Image, StyleSheet, Text } from "react-native";

import BackButton from "./src/components/Button/BackButton";
import FirebaseInteractor from "./src/firebase/FirebaseInteractor";
import { UID } from "./src/models/types";
import AdminScreen from "./src/screens/AdminScreen";
import EmailVerificationScreen from "./src/screens/EmailVerificationScreen";
import GameFlow from "./src/screens/Game/GameFlow";
import HomeScreen from "./src/screens/HomeScreen";
import ChangePassword from "./src/screens/Login/ChangePassword";
import SettingsScreen from "./src/screens/Login/Settings";
import signInFlow from "./src/screens/Login/SignInFlow";
import OnboardingSwiper from "./src/screens/Onboarding/OnboardingSwiper";
import Test from "./src/screens/Test/Test";
import TestResults from "./src/screens/Test/TestResults";
import TestWelcome from "./src/screens/Test/TestWelcome";
import { GameStateContext } from "./src/utils/context";

const Stack = createNativeStackNavigator();
export default function App() {
  const HOME_HEADER_OPTIONS = {
    headerTitle: () => {
      return (
        <Image
          style={styles.mainImage}
          source={require("./src/assets/logos/flow-icon.png")}
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
            component={OnboardingSwiper}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignInFlow"
            component={signInFlow}
            options={{ headerShown: false, gestureEnabled: false }}
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
            component={HomeScreen}
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
            name="ChangePassword"
            component={ChangePassword}
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
            name="Game"
            component={GameFlow}
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
          <Stack.Screen name="TestWelcome" component={TestWelcome} />
          <Stack.Screen
            name="Test"
            component={Test}
            options={{ headerBackVisible: false }}
          />
          <Stack.Screen
            name="TestResults"
            component={TestResults}
            options={{ headerBackVisible: false }}
          />
          <Stack.Screen
            name="RevisitOnboarding"
            component={OnboardingSwiper}
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
