import React from "react";
import { StyleSheet, Text } from "react-native";

import { REGULAR_FONT } from "../../constants/fonts";

export default function RegularText({ style, children }: any) {
  return <Text style={{ ...style, ...styles.regularText }}>{children}</Text>;
}

const styles = StyleSheet.create({
  regularText: {
    fontFamily: REGULAR_FONT,
  },
});
