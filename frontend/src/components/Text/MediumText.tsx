import { StyleSheet, Text } from 'react-native';
import React from 'react';

export default function MediumText({ style, children }: any) {
    return <Text style={{ ...style, ...styles.mediumText }}>{children}</Text>
}

const styles = StyleSheet.create({
    mediumText: {
        fontFamily: 'Montserrat_500Medium'
    }
})
