import React, { ReactElement } from 'react';
import { Image, StyleSheet, View, Pressable } from 'react-native';
import MediumText from '../../components/Text/MediumText';
import RegularText from '../../components/Text/RegularText';

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
            <RegularText style={styles.content}>{screenContent}</RegularText>
            {hasNavButton &&
                <Pressable onPress={() => { navigation.navigate(route); }} style={styles.button}>
                    <MediumText style={styles.buttonContent}>{navButtonTitle}</MediumText>
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
        fontSize: 20,
        color: '#D16B50'
    }
});
