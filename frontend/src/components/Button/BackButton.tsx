import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, View, TouchableOpacity } from "react-native";

interface BackButtonProps {
  onPress: () => void;
  isHome?: boolean;
}

export default function BackButton({
  onPress,
  isHome = true,
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
          }}
          source={require("../../assets/back-arrow.png")}
        />
        {isHome && (
          <Image
            style={{ resizeMode: "contain", width: 20, height: 20 }}
            source={require("../../assets/home-icon.png")}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

// TODO: Edge case: Android hardware back button (bottom of screen)
