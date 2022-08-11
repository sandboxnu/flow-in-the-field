import React from "react";
import { TouchableOpacity, Text, StyleProp, ViewStyle } from "react-native";

interface CustomButtonProps {
  onPress: () => void;
  disabled: boolean;
  enabledStyle: StyleProp<ViewStyle>;
  disabledStyle: StyleProp<ViewStyle>;
  enabledTextStyle: StyleProp<ViewStyle>;
  disabledTextStyle: StyleProp<ViewStyle>;
  text: string;
}
export default function CustomButton({
  onPress,
  disabled,
  enabledStyle,
  disabledStyle,
  enabledTextStyle,
  disabledTextStyle,
  text,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={disabled ? disabledStyle : enabledStyle}
    >
      <Text style={disabled ? disabledTextStyle : enabledTextStyle}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
