import React, { ReactElement } from 'react';
import { Modal, Image, StyleSheet, View, Text, Button } from 'react-native';


interface OnboardingScreenProps {
    screenHeader: string;
    screenContent: string;
    screenImage: string;
    navigation: any;
    route: string;
}

export default function OnboardingScreen({
    screenImage, 
    screenContent, 
    screenHeader,
    navigation,
    route}: OnboardingScreenProps): ReactElement {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{uri: screenImage}}/>
            <Text style={styles.header}> {screenHeader} </Text>
            <Text style={styles.content}> {screenContent} </Text>
            <Button title="Next" onPress={() => navigation.navigate(route)}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 100,
        width: 100
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16
    },
    content: {
        fontSize: 14,
        margin: 16
    }
});