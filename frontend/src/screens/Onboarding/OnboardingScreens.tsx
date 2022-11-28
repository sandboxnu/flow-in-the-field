import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

import { BLUE, PURPLE, TURQUOISE } from '../../constants/colors';
import FirebaseInteractor from '../../firebase/firebaseInteractor';
import OnboardingScreen from './OnboardingScreen';

interface OnboardingScreenProps {
  navigation: any;
  route: any;
}
const fi = new FirebaseInteractor();

export default function OnboardingScreens({
  navigation,
  route,
}: OnboardingScreenProps) {
  const [gameType, setGameType] = useState("pairing");
  const [compensation, setCompensation] = useState("25");

  useEffect(() => {
    fi.getUser().then((user) => {
      setGameType(user.gameType);
    });
  }, []);

  useEffect(() => {
    fi.getCompensation().then((c) => setCompensation(c.toString()));
  });

  return (
    <Swiper
      showsButtons={false}
      loop={false}
      pagingEnabled
      dotStyle={styles.dots}
      activeDotStyle={styles.activeDots}
    >
      <OnboardingScreen
        bgColor={BLUE}
        screenContent={
          "Thank you for agreeing to \nparticipate in our study! " +
          "For the next week, your goal is to learn as many " +
          "Turkish words as possible."
        }
      />
      <OnboardingScreen
        bgColor={TURQUOISE}
        screenContent={
          gameType === "pairing"
            ? "To achieve your goal, you'll be using this app!\n\n " +
              "Here is how it works:\n • You'll see a set of English " +
              "words and a set of Turkish words.\n • You'll try to " +
              "match each English word to the correct Turkish word, " +
              "then you'll receive feedback.\n • The more you practice, " +
              "the better you'll get!"
            : "To achieve your goal, you'll be using this app!\n\n " +
              "Here is how it works:\n • You'll see one English word " +
              "and a set of Turkish words.\n • You'll try to match " +
              "the English word to the correct Turkish word, then you'll " +
              "receive feedback.\n • The more you practice, " +
              "the better you'll get!"
        }
      />
      <OnboardingScreen
        bgColor={PURPLE}
        screenContent={`Over the next week, you can use this app to practice as much or as little as you like. At the end of the week, you'll receive a vocabulary test. After you finish the test, you’ll receive $${compensation} for your participation.`}
        hasNavButton
        navButtonTitle="done"
        navigation={navigation}
        route="HomeScreen"
      />
    </Swiper>
  );
}

const styles = StyleSheet.create({
  dots: {
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 16,
    height: 16,
    borderRadius: 16,
  },
  activeDots: {
    backgroundColor: "#FFF",
    width: 16,
    height: 16,
    borderRadius: 16,
  },
});
