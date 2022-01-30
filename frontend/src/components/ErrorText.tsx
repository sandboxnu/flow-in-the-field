import { StyleSheet, Text } from 'react-native';
import React from 'react';

interface ErrorTextProps {
  message?: string;
}

export default function ErrorText({ message }: ErrorTextProps) {
  if (message) {
    return <Text style={styles.errorText}>{message}</Text>;
  }
  return null;
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
  },
});
