import React from "react";
import { StyleSheet, Text } from "react-native";

import { BOLD_FONT } from "../../constants/fonts";

export default function BoldText({ style, children }: any) {
  return <Text style={{ ...style, ...styles.boldText }}>{children}</Text>;
}

const styles = StyleSheet.create({
  boldText: {
    fontFamily: BOLD_FONT,
  },
});
