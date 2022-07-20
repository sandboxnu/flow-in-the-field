import { StyleSheet, Text } from 'react-native';
import React from 'react';

export default function RegularText({ style, children }: any) {
    return <Text style={{ ...style, ...styles.regularText }}>{children}</Text>
}

const styles = StyleSheet.create({
    regularText: {
        fontFamily: 'Montserrat_400Regular'
    }
})
