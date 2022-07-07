import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";

interface TextIconButtonProps {
    text: string;
    icon: number;
    onPress: () => void;
    testNotAvailable?: boolean;
}
export default function TextIconButton({ text, icon, onPress, testNotAvailable }: TextIconButtonProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={testNotAvailable ? { ...styles.main, backgroundColor: "#6E81E759" } : styles.main}>
                <Image source={icon} style={styles.image} />
                <Text style={styles.text}>{text}</Text>
            </View>
        </TouchableOpacity>)
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: "#6E81E7",
        borderRadius: 20,
        width: "90%",
        flexDirection: "row",
        paddingHorizontal: 5,
        paddingVertical: "4%",
        marginVertical: "2%",
        alignItems: "center"
    },
    text: {
        fontSize: 22,
        fontWeight: "400",
        margin: "auto",
        textAlign: "left",
        flex: 1,
        color: "white"
    },
    image: {
        resizeMode: "contain",
        maxWidth: 35,
        maxHeight: 35,
        marginHorizontal: 25
    }
});