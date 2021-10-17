import React, { ReactElement } from 'react';
import { Modal, Image, StyleSheet, View, Text } from 'react-native';


interface OnboardingScreenProps {
    screenHeader: string;
    screenContent: string;
    screenImage: string;
}

export default function OnboardingScreen({screenImage, screenContent, screenHeader}: OnboardingScreenProps): ReactElement {
    return (
        <Modal style={styles.container}>
            <Image source={require(screenImage)}/>
            <Text style={styles.header}> screenHeader </Text>
            <Text style={styles.content}> screenContent </Text>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    header: {

    },
    content: {

    }
});