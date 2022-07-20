import React from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import MediumText from "../Text/MediumText";

interface SmallTextIconButtonProps {
    text: string;
    icon: number;
    onPress: () => void;
}
export default function TextIconButton({ text, icon, onPress }: SmallTextIconButtonProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.main}>
                    <MediumText style={styles.text}>{text}</MediumText>
                    <Image source={icon} style={styles.image} />
                </View>
            </TouchableOpacity>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 7
    },
    main: {
        backgroundColor: "#d16b50",
        borderRadius: 20,
        width: 160,
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
