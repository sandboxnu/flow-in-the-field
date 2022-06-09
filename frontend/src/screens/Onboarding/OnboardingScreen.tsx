import React, { ReactElement } from 'react';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';

const FLOW_ICON = '../../assets/flow-icon-light.png'

interface OnboardingScreenProps {
    screenContent: string;
    bgColor: string;
    hasNavButton?: boolean;
    navButtonTitle?: string;
    navigation?: any;
    route?: string;
}

export default function OnboardingScreen({
    screenContent,
    bgColor,
    hasNavButton,
    navButtonTitle,
    navigation,
    route
}: OnboardingScreenProps): ReactElement {

    const backgroundStyle = {
        backgroundColor: bgColor
    };

    return (
        <View style={[styles.container, backgroundStyle]}>
            <Image style={styles.image} source={require(FLOW_ICON)} />
            <Text style={styles.content}>{screenContent}</Text>
            {hasNavButton &&
                <Pressable onPress={() => { navigation.navigate(route); }} style={styles.button}>
                    <Text style={styles.buttonContent}>{navButtonTitle}</Text>
                </Pressable>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingLeft: 48,
        paddingRight: 48,
        paddingTop: '50%',
    },
    image: {
        height: 64,
        width: '100%',
        resizeMode: 'contain',
        marginBottom: 24
    },
    content: {
        fontFamily: 'Montserrat_400Regular',
        fontWeight: '500',
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center'
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        width: 130,
        maxHeight: 30,
        marginTop: 32,
        borderRadius: 8,
        overflow: 'hidden'
    },
    buttonContent: {
        backgroundColor: '#FFF',
        fontFamily: 'Montserrat_500Medium',
        fontSize: 20,
        color: '#D16B50'
    }
});
