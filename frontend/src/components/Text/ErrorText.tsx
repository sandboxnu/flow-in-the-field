import { StyleSheet } from 'react-native';
import React from 'react';
import RegularText from './RegularText';

interface ErrorTextProps {
    message?: string;
}

export default function ErrorText({ message }: ErrorTextProps) {
    if (message) {
        return <RegularText style={styles.errorText}>{message}</RegularText>
    } else {
        return null;
    }
}

const styles = StyleSheet.create({
    errorText: {
        color: "red",
        position: 'absolute',
        bottom: "100%"
    }
})
