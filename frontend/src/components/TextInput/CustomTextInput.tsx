import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface CustomTextInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholderText: string;
  secureText: boolean;
}

export default function CustomTextInput({
  value,
  setValue,
  placeholderText,
  secureText,
}: CustomTextInputProps) {
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
    borderWidth: 1,
    borderColor: '#4D4661',
    paddingHorizontal: 9,
    height: 36,
    width: '60%',
    marginVertical: '4%',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 35,
    letterSpacing: 0,
    textAlign: 'left',
  },
});
