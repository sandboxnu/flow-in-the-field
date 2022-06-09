import { StyleSheet, Text } from 'react-native';
import React from 'react';
interface ErrorTextProps {
    message?: string;
}

export default function ErrorText({ message }: ErrorTextProps) {
    if (message) {
        return <Text style={styles.errorText}>{message}</Text>
    } else {
        return null;
    }
}

const styles = StyleSheet.create({
    errorText: {
        color: "red",
        fontFamily: 'Montserrat_400Regular',
        position: 'absolute',
        bottom: "100%",
    }
})