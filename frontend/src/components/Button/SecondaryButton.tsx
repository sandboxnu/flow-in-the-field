import React, { ReactNode } from "react";
import { TouchableOpacity, Text, StyleSheet, View, StyleSheetProperties, StyleProp, ViewStyle } from "react-native";
import CustomButton from "./CustomButton";

interface SecondaryButtonProps {
    onPress: () => void;
    disabled: boolean;
    text: String;
}
export default function SecondaryButton(props: SecondaryButtonProps) {
    return CustomButton({
        ...props,
        enabledStyle: styles.enabledStyle,
        disabledStyle: {
            ...styles.enabledStyle,
            ...styles.additionalDisabledStyle
        },
        enabledTextStyle: styles.enabledTextStyle,
        disabledTextStyle: styles.disabledTextStyle
    })
}

const styles = StyleSheet.create({
    enabledStyle: {
        backgroundColor: 'white',
        borderColor: "#6E81E7",
        borderWidth: 2,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        paddingHorizontal: "5%",
        marginHorizontal: '3%',
        marginVertical: "1%",
        paddingVertical: 10
    },
    additionalDisabledStyle: { borderColor: "#6E81E7" },
    enabledTextStyle: {
        color: "#6E81E7",
        backgroundColor: "transparent",
        fontFamily: 'Montserrat_700Bold'
    },
    disabledTextStyle: {
        color: "#6E81E7",
        backgroundColor: "transparent",
        fontFamily: 'Montserrat_700Bold'
    }
});
