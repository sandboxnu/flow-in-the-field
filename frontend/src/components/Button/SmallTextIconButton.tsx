import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";

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
                <Text style={styles.text}>{text}</Text>
                <Image source={icon} style={styles.image} />
            </View>
        </TouchableOpacity>
        </View>)
}

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 8  
    },
    main: {
        backgroundColor: "#d16b50",
        borderRadius: 20,
        width: 150,
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
        color: "white",
        fontFamily: 'Montserrat_500Medium'
    },
    image: {
        resizeMode: "contain",
        maxWidth: 68,
        maxHeight: 60,
        marginRight: 5
    }
});
