import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { DraxView } from "react-native-drax";
import { ORANGE } from "../constants/colors";

interface DroppableRowProps {
  turkish: string;
  english?: string;
  correctEnglish: string;
  removeWord: () => void;
  wordDropped: (word: string) => void;
  showingResults: boolean;
}

export default function DroppableRow({
  turkish,
  english,
  removeWord,
  wordDropped,
  showingResults,
  correctEnglish,
}: DroppableRowProps) {
  const correct = english === correctEnglish || !english;
  const extraEnglishInfo = showingResults
    ? correct
      ? showingResultsStyles.correctEnglishWord
      : showingResultsStyles.incorrectEnglishWord
    : {};
  const [dragging, setDragging] = useState(false);
  return (
    <View style={styles.container}>
      {english || showingResults ? (
        <DraxView
          style={{ ...styles.englishTextContainer, ...extraEnglishInfo }}
          dragPayload={showingResults ? undefined : english}
          draggable={!showingResults}
          draggingStyle={{ opacity: 0.3 }}
          dragReleasedStyle={{ opacity: 0.3 }}
          key={1}
          onDragStart={() => setDragging(false)}
          hoverDraggingStyle={{ borderColor: "transparent" }}
          onDrag={event => {
            if (
              Math.abs(event.dragTranslation.x) > 1 ||
              Math.abs(event.dragTranslation.y) > 1
            ) {
              setDragging(true);
            }
          }}
          onDragEnd={() => {
            if (!dragging) {
              removeWord();
            }
            setDragging(false);
          }} // This is a hack since there is no way to interact draxview with a touch handler
          longPressDelay={1}
        >
          <Text style={styles.englishText}>
            {showingResults ? correctEnglish : english}
          </Text>
        </DraxView>
      ) : (
        <DraxView
          style={styles.draxView}
          onReceiveDragDrop={({
            dragged: { payload },
          }: {
            dragged: { payload: string };
          }) => {
            wordDropped(payload);
          }}
          key={2}
        />
      )}
      <View style={styles.turkishContainer}>
        <Text style={styles.turkishText}>{turkish}</Text>
      </View>
    </View>
  );
}

const showingResultsStyles = StyleSheet.create({
  incorrectEnglishWord: {
    backgroundColor: ORANGE,
    borderColor: "transparent",
  },
  correctEnglishWord: {
    backgroundColor: "#5BBAB7",
    borderColor: "transparent",
  },
});

const styles = StyleSheet.create({
  draxView: {
    borderColor: "#5BBAB7",
    borderWidth: 3,
    width: "40%",
    borderStyle: "dashed",
    height: "100%",
    marginHorizontal: "5%",
    borderRadius: 0.0001,
  },
  turkishContainer: {
    justifyContent: "center",
    width: "40%",
    height: "100%",
    backgroundColor: "#C4C4C4",
    marginHorizontal: "5%",
  },
  turkishText: {
    textAlign: "center",
    color: "white",
    backgroundColor: "#C4C4C4",
  },
  englishTextContainer: {
    width: "40%",
    textAlign: "center",
    borderColor: "white",
    borderStyle: "dashed",
    borderWidth: 2,
    backgroundColor: "#5EAFDF",
    height: "100%",
    color: "white",
    marginHorizontal: "5%",
    justifyContent: "center",
    borderRadius: 0.000001,
  },
  englishText: {
    color: "white",
    textAlign: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "12.5%",
    paddingVertical: "1%",
  },
});
