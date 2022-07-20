import React from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import MediumText from "../Text/MediumText";

interface TextIconButtonProps {
    text: string;
    icon: number;
    onPress: () => void;
    testNotAvailable?: boolean;
}

export default function TextIconButton({ text, icon, onPress, testNotAvailable }: TextIconButtonProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={testNotAvailable ? { ...styles.main, backgroundColor: "#aba9a2" } : styles.main}>
                <MediumText style={styles.text}>{text}</MediumText>
                <Image source={icon} style={styles.image} />
            </View>
        </TouchableOpacity>)
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: "#d16b50",
        borderRadius: 20,
        width: "85%",
        flexDirection: "row",
        paddingHorizontal: 5,
        paddingVertical: "4%",
        marginVertical: 5,
        alignItems: "center",
        justifyContent: "space-between"
    },
    text: {
        fontSize: 22,
        fontWeight: "400",
        margin: "auto",
        textAlign: "center",
        flex: 1,
        color: "white"
    },
    image: {
        resizeMode: "contain",
        maxWidth: 68,
        maxHeight: 60,
        marginRight: 5
    }
});
