import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { BLUE } from "../constants/colors";

export function LoadingScreen() {
  return (
    <View style={style.container}>
      <ActivityIndicator size="large" color={BLUE} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
});
