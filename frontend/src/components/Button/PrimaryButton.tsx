import { StyleSheet } from "react-native";
import CustomButton from "./CustomButton";

interface PrimaryButtonProps {
    onPress: () => void;
    disabled: boolean;
    text: String;
}

export default function PrimaryButton(props: PrimaryButtonProps) {
    return CustomButton({
        ...props,
        enabledStyle: styles.enabledStyle,
        disabledStyle: {
            ...styles.enabledStyle,
            ...styles.additionalDisabledStyle
        },
        enabledTextStyle: styles.enabledTextStyle,
        disabledTextStyle: styles.enabledTextStyle
    })
}

const styles = StyleSheet.create({
    enabledStyle: {
        backgroundColor: "#6E81E7",
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
    additionalDisabledStyle: {
        backgroundColor: "#6E81E725",
        borderColor: "#FFF"
    },
    enabledTextStyle: {
        color: "white",
        backgroundColor: "transparent",
        fontFamily: 'Montserrat_700Bold'
    },
})
