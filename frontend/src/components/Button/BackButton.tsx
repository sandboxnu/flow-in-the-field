import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, Image, View, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
interface BackButtonProps {
    onPress: () => void;
}

export default function BackButton(props: BackButtonProps) {
    let navigation = useNavigation();

    return <TouchableOpacity
        onPress={() => {
            props.onPress();
            navigation.goBack();
        }}>
        <View style={{ flexDirection: 'row' }}>
            <Image style={{ resizeMode: "contain", width: 20, height: 20, marginRight: 2 }} source={require('../../assets/back-arrow.png')} />
            <Image style={{ resizeMode: "contain", width: 20, height: 20 }} source={require('../../assets/home-icon.png')} />
        </View>
    </TouchableOpacity>
}

// TODO: Edge case: Android hardware back button (bottom of screen)
