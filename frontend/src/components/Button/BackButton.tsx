import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
interface BackButtonProps {
    onPress: () => void;
}

export default function BackButton(props: BackButtonProps) {
    let navigation = useNavigation();

    return <Icon.Button
        onPress={() => {
            props.onPress();
            navigation.goBack();
        }}
        name='chevron-left'
        color='#6E81E7'
        backgroundColor='transparent'>
            <Image style={{resizeMode: "contain", maxWidth: 40,maxHeight: 40, marginBottom: 3 }} source={require('../../assets/home_icon.png')}/>
        </Icon.Button>
}

// TODO: Edge case: Android hardware back button (bottom of screen)
