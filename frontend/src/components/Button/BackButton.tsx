import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, Image, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { LIGHTPURPLE } from "../../constants/colors";
interface BackButtonProps {
  onPress: () => void;
  isHome?: boolean;
  tint?: string;
}

export default function BackButton({
  onPress,
  isHome = true,
  tint = LIGHTPURPLE,
}: BackButtonProps) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
        navigation.goBack();
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{
            resizeMode: "contain",
            width: 20,
            height: 20,
            marginRight: 2,
            tintColor: tint,
          }}
          source={require("../../assets/back-arrow.png")}
        />
        {isHome && (
          <Image
            style={{
              resizeMode: "contain",
              width: 20,
              height: 20,
              tintColor: tint,
            }}
            source={require("../../assets/home-icon.png")}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

// TODO: Edge case: Android hardware back button (bottom of screen)
