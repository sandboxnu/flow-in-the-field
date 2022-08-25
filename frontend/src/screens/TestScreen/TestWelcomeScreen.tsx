import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { UID } from "../../models/types";

const TEST_WELCOME_HEADER_OPTIONS = {
  headerTitle: () => {
    return (
      <Image
        style={styles.mainImage}
        source={require("../../assets/flow-icon-light.png")}
      />
    );
  },
  title: "",
  headerTitleAlign: "center" as "center",
  headerShadowVisible: false,
  headerTintColor: "#D16B50",
  headerBackTitle: "",
  headerStyle: {
    backgroundColor: "#6E81E7",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
};

const fi = new FirebaseInteractor();

export interface TestWelcomeScreenProps {
  route: any;
}

export default function TestWelcomeScreen(props: TestWelcomeScreenProps) {
  const navigation = useNavigation();
  const [compensation, setCompensation] = useState("25");

  useEffect(() => {
    fi.getCompensation().then((c) => setCompensation(c.toString()));
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions(TEST_WELCOME_HEADER_OPTIONS);
  }, [navigation]);

  const startTest = () => {
    fi.startTestSession().then((testSessionId: UID) =>
      navigation.navigate("TestScreen", { testSessionId })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        It’s time for your test! You will answer 50 questions testing your
        knowledge of Turkish words. Before you start, make sure you are in a
        quiet location where you can spend the next few minutes focusing on the
        test.
      </Text>
      <Text style={styles.paragraph}>
        During the test, please do not cheat! We are interested in how many
        words you can recall on your own, without any help. You will receive the
        full ${compensation} for your participation regardless of how many test
        questions you answer correctly, so go ahead and try your best!
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={() => startTest()}>
        <Text style={{ color: "#FFF", fontSize: 22 }}>start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainImage: {
    width: 94,
    resizeMode: "contain",
    height: 51,
  },
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#6E81E7",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    height: "100%",
    paddingTop: "5%",
  },
  startButton: {
    backgroundColor: "#5FBFF8",
    borderColor: "#5FBFF8",
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "7.5%",
    width: "75%",
  },
  paragraph: {
    color: "white",
    width: "75%",
    fontSize: 18,
    fontWeight: "500",
  },
});
