import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { DraxView } from "react-native-drax";

import { BLUE, GREY } from "../constants/colors";
import RegularText from "./Text/RegularText";

interface DroppableRowProps {
  turkish: string;
  english?: string;
  removeWord: () => void;
  wordDropped: (word: string) => void;
  isPairing: boolean;
}

export default function DroppableRow({
  turkish,
  english,
  removeWord,
  wordDropped,
  isPairing,
}: DroppableRowProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{ ...styles.turkishContainer }}>
        <RegularText style={styles.turkishText}>{turkish}</RegularText>
      </View>
      {english ? (
        <DraxView
          style={{ ...styles.englishTextContainer }}
          dragPayload={english}
          draggable
          draggingStyle={{ opacity: 0.3 }}
          dragReleasedStyle={{ opacity: 0.3 }}
          key={1}
          onDragStart={() => setDragging(false)}
          hoverDraggingStyle={{ borderColor: "transparent" }}
          onDrag={(event) => {
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
          <RegularText style={styles.englishText}>{english}</RegularText>
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
    </View>
  );
}

const styles = StyleSheet.create({
  draxView: {
    borderColor: "#5BBAB7",
    borderWidth: 3,
    width: "45%",
    borderStyle: "dashed",
    height: "100%",
    // marginHorizontal: "5%",
    borderRadius: 0.0001,
  },
  turkishContainer: {
    justifyContent: "center",
    width: "45%",
    height: "100%",
    backgroundColor: BLUE,
    // marginHorizontal: "5%"
  },
  turkishText: {
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent",
  },
  englishTextContainer: {
    width: "45%",
    textAlign: "center",
    borderColor: "white",
    borderStyle: "dashed",
    borderWidth: 2,
    backgroundColor: GREY,
    height: "100%",
    color: "white",
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
    justifyContent: "space-between",
    width: "80%",
    height: "10%",
    // paddingVertical: "1%",
    marginVertical: "1%",
  },
});
