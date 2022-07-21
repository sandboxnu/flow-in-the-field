import React from "react";
import { TextInput, StyleSheet } from "react-native";

import { REGULAR_FONT } from "../../constants/fonts";

interface SignInFlowCustomTextInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholderText: string;
  secureText: boolean;
}

export default function SignInFlowCustomTextInput({
  value,
  setValue,
  placeholderText,
  secureText,
}: SignInFlowCustomTextInputProps) {
  return (
    <TextInput
      placeholderTextColor="#4D4661"
      value={value}
      onChangeText={setValue}
      secureTextEntry={secureText}
      style={styles.textInput}
      placeholder={placeholderText}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    height: 36,
    width: "85%",
    marginVertical: "4%",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "left",
    fontFamily: REGULAR_FONT,
  },
});
