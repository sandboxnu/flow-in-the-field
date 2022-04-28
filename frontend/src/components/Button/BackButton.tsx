import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, Image, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
            <View style={{flexDirection: 'row'}}>
                <Image style={{resizeMode: "contain", maxWidth: 20,maxHeight: 20, marginRight: 5}} source={require('../../assets/back_arrow.png')}/>
                <Image style={{resizeMode: "contain", maxWidth: 20,maxHeight: 20}} source={require('../../assets/home_icon.png')}/>
            </View>
        </TouchableOpacity>
}

// TODO: Edge case: Android hardware back button (bottom of screen)
