import { StyleSheet, Text } from 'react-native';
import React from 'react';

export default function BoldText({ style, children }: any) {
    return <Text style={{ ...style, ...styles.boldText }}>{children}</Text>
}

const styles = StyleSheet.create({
    boldText: {
        fontFamily: 'Montserrat_700Bold'
    }
})
