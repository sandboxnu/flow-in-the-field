import React from "react";
import { StyleSheet } from "react-native";

import MediumText from "../../components/Text/MediumText";
import { BLUE } from "../../constants/colors";
import GameScreen, { GameScreenProps } from "./gameScreen";

export default function SelectingGameScreen(props: GameScreenProps) {
  const selectingTopRenderer = (numCorrect: number, numTotal: number) => {
    return (
      <MediumText style={styles.correctText}>
        {numCorrect === 1 ? "correct" : "incorrect"}
      </MediumText>
    );
  };

  const selectingShuffleFunction = (words: any[]) => {
    return [words.map((word, i) => word.english)[0]];
  };

  return GameScreen({
    route: props.route,
    isPairing: false,
    topScreenRenderFunction: selectingTopRenderer,
    shuffleFunction: selectingShuffleFunction,
  });
}

const styles = StyleSheet.create({
  correctText: {
    color: BLUE,
    fontSize: 64,
    textAlign: "center",
  },
});
