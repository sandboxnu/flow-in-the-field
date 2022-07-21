import React from "react";
import { StyleSheet, Text } from "react-native";

import { MEDIUM_FONT } from "../../constants/fonts";

export default function MediumText({ style, children }: any) {
  return <Text style={{ ...style, ...styles.mediumText }}>{children}</Text>;
}

const styles = StyleSheet.create({
  mediumText: {
    fontFamily: MEDIUM_FONT,
  },
});
