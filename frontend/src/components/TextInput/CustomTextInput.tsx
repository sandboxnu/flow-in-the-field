import React from "react";
import { TextInput, StyleSheet } from "react-native";

import { REGULAR_FONT } from "../../constants/fonts";

interface CustomTextInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholderText: string;
  secureText: boolean;
  width?: string;
}

export default function CustomTextInput({
  value,
  setValue,
  placeholderText,
  secureText,
  width = "70%",
}: CustomTextInputProps) {
  return (
    <TextInput
      placeholderTextColor="#4D4661"
      value={value}
      onChangeText={setValue}
      secureTextEntry={secureText}
      style={{ ...styles.textInput, width }}
      placeholder={placeholderText}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "#4D4661",
    paddingHorizontal: 9,
    height: 36,
    width: "70%",
    marginVertical: "4%",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 31,
    letterSpacing: 0,
    textAlign: "left",
    fontFamily: REGULAR_FONT,
  },
});
