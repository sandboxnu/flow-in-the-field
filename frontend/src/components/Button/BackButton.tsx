import { useNavigation } from "@react-navigation/native";
import React from "react";
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
        color='#D16B50'
        backgroundColor='transparent'
    />
}

// TODO: Disable being able to swipe to go back
// TODO: Edge case: Android hardware back button