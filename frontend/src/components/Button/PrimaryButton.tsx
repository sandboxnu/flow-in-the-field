import { StyleSheet, StyleProp, ViewStyle } from "react-native";

import { BOLD_FONT } from "../../constants/fonts";
import CustomButton from "./CustomButton";

interface PrimaryButtonProps {
  onPress: () => void;
  disabled: boolean;
  text: string;
  style?: StyleProp<ViewStyle>;
}

export default function PrimaryButton(props: PrimaryButtonProps) {
  const overrideStyles = typeof props.style === "object" ? props.style : {};
  return CustomButton({
    ...props,
    enabledStyle: {
      ...styles.enabledStyle,
      ...overrideStyles,
    },
    disabledStyle: {
      ...styles.enabledStyle,
      ...styles.additionalDisabledStyle,
      ...overrideStyles,
    },
    enabledTextStyle: styles.enabledTextStyle,
    disabledTextStyle: styles.enabledTextStyle,
  });
}

const styles = StyleSheet.create({
  enabledStyle: {
    backgroundColor: "#6E81E7",
    borderColor: "#6E81E7",
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
    paddingHorizontal: "5%",
    marginHorizontal: "3%",
    marginVertical: "1%",
    paddingVertical: 10,
  },
  additionalDisabledStyle: {
    backgroundColor: "#6E81E725",
    borderColor: "#FFF",
  },
  enabledTextStyle: {
    color: "white",
    backgroundColor: "transparent",
    fontFamily: BOLD_FONT,
  },
});
