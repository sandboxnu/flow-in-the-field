import React from "react";
import { StyleSheet, Text } from "react-native";
interface ErrorTextProps {
  message?: string;
}

export default function ErrorText({ message }: ErrorTextProps) {
  if (message) {
    return <Text style={styles.errorText}>{message}</Text>;
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    position: "absolute",
    bottom: "100%",
  },
});
