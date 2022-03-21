import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button } from "react-native";

interface BackButtonProps {
    onPress: () => void;
}

export default function BackButton(props: BackButtonProps) {
    let navigation = useNavigation();

    return <Button
        onPress={() => {
            props.onPress();
            navigation.goBack();
        }}
        title="Back" /> // TODO: Change Back to chevron
}