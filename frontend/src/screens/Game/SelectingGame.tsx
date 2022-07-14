import React from "react";
import { Text, StyleSheet } from "react-native";

import { BLUE } from "../../constants/colors";
import Game, { GameScreenProps } from "./Game";

export default function SelectingGame(props: GameScreenProps) {
  const selectingTopRenderer = (numCorrect: number, numTotal: number) => {
    return (
      <Text style={styles.correctText}>
        {numCorrect === 1 ? "correct" : "incorrect"}
      </Text>
    );
  };

  const selectingShuffleFunction = (words: any[]) => {
    return [words.map((word, i) => word.english)[0]];
  };

  return Game({
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
