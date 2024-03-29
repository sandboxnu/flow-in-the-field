import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import Swiper from "react-native-swiper";

import { LIGHTPURPLE } from "../../constants/colors";
import GameTutorialScreen from "./GameTutorialScreen";

// Images to display on pairing and selecting tutorial pages
const tutorialImages = {
  page1: require("../../assets/tutorial-page-1.png"),
  page2: require("../../assets/tutorial-page-2.png"),
  page3: require("../../assets/tutorial-page-3.png"),
  page5Pairing: require("../../assets/pairing-tutorial-page-5.png"),
  page5Selecting: require("../../assets/selecting-tutorial-page-5.png"),
  page6: require("../../assets/tutorial-page-6.png"),
  page7: require("../../assets/tutorial-page-7.png"),
};

interface GameTutorialScreenProps {
  isPairing: boolean;
  onFinish: Function;
}

const customRenderPagination = (index: number, total: number, context: any) => {
  const defaultStyles = StyleSheet.create({
    dots: {
      width: 16,
      height: 16,
      borderRadius: 16,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    },
  });

  const styles = StyleSheet.create({
    seenDots: {
      ...defaultStyles.dots,
      backgroundColor: LIGHTPURPLE,
    },
    unseenDots: {
      ...defaultStyles.dots,
      backgroundColor: "white",
      borderWidth: 2,
      borderColor: LIGHTPURPLE,
    },
    pagination: {
      position: "absolute",
      bottom: 25,
      left: 0,
      right: 0,
      flexDirection: "row",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
  });

  // By default, dots only show when `total` >= 2
  if (total <= 1) return null;

  const SeenDot = <View style={styles.seenDots} />;

  const UnseenDot = <View style={styles.unseenDots} />;

  const dots = [];
  for (let i = 0; i < context.state.total; i++) {
    dots.push(
      i <= index
        ? React.cloneElement(SeenDot, { key: i })
        : React.cloneElement(UnseenDot, { key: i })
    );
  }

  return (
    <View pointerEvents="none" style={styles.pagination}>
      {dots}
    </View>
  );
};

export default function GameTutorialScreens({
  isPairing,
  onFinish,
}: GameTutorialScreenProps): ReactElement {
  return (
    <Swiper
      showsButtons={false}
      loop={false}
      pagingEnabled
      renderPagination={customRenderPagination}
    >
      <GameTutorialScreen
        screenContent={
          "Drag the English word into the box that matches with " +
          "the Turkish word."
        }
        imagePath={tutorialImages.page1}
        onFinish={onFinish}
      />
      <GameTutorialScreen
        screenContent={
          "You can change your answer by dragging the English " +
          "word into a different box."
        }
        imagePath={tutorialImages.page2}
        onFinish={onFinish}
      />
      <GameTutorialScreen
        screenContent="Made a mistake? Tap the word to return it to the top."
        imagePath={tutorialImages.page3}
        onFinish={onFinish}
      />
      <GameTutorialScreen
        screenContent={
          isPairing
            ? "Once you have matched all the words, press done to " +
              "submit your answers."
            : "Once you have matched the word, press done to " +
              "submit your answers."
        }
        doneButton
        onFinish={onFinish}
      />
      <GameTutorialScreen
        screenContent={
          isPairing
            ? "Once you've submitted your answers, you will see your results.\n "
            : "Once you've submitted your answer, you will see your results.\n"
        }
        secondaryScreenContent={
          isPairing
            ? "Green means correct and red means incorrect."
            : "Green means correct and red means incorrect. Words " +
              "that were unmatched remain blue."
        }
        imagePath={
          isPairing
            ? tutorialImages.page5Pairing
            : tutorialImages.page5Selecting
        }
        onFinish={onFinish}
      />
      <GameTutorialScreen
        screenContent="On the next page, you will see the correct answers. The English words will be paired with their corresponding Turkish words."
        imagePath={tutorialImages.page6}
        onFinish={onFinish}
      />
      <GameTutorialScreen
        screenContent={
          `Click "next round" to play another game or "end session" ` +
          `to return to the home page.`
        }
        imagePath={tutorialImages.page7}
        onFinish={onFinish}
      />
      <GameTutorialScreen
        screenContent="Try the game out for yourself."
        hasNavButton
        navButtonTitle="start session"
        onFinish={onFinish}
      />
    </Swiper>
  );
}
