import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import FirebaseInteractor from "../firebase/firebaseInteractor";

const CONSENT_HEADER_OPTIONS = {
  headerTitle: () => {
    return (
      <Image
        style={styles.mainImage}
        source={require("../assets/flow-icon-light.png")}
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

export interface ConsentScreenProps {
  route: any;
}

export default function ConsentScreen(props: ConsentScreenProps) {
  const navigation = useNavigation();
  const [, setCopyScrollPos] = useState(0);
  const [consentText, setConsentText] = useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions(CONSENT_HEADER_OPTIONS);
  }, [navigation]);

  useEffect(() => {
    fi.getConsentText().then((text) => {
      setConsentText(text);
    });
  }, []);

  const consentGiven = () => {
    fi.updateHasGivenConsent().then(() => {
      navigation.navigate("Onboarding", { route: "HomeScreen" });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <ScrollView
          style={styles.scrollView}
          onScroll={(event) => {
            setCopyScrollPos(event.nativeEvent.contentOffset.y);
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 20 }}>{consentText}</Text>
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.consentButton} onPress={consentGiven}>
          <Text style={{ color: "#FFF", fontSize: 22 }}>I consent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            fi.logout().then(() => {
              navigation.navigate("SignInFlow");
            });
          }}
          style={styles.noConsentButton}
        >
          <Text style={{ color: "#FFF", fontSize: 22 }}>I do not consent</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "space-around",
    width: "100%",
    height: "100%",
    paddingTop: "5%",
  },
  textContainer: {
    width: "95%",
    height: "65%",
    marginTop: "12.5%",
    flexDirection: "column",
  },
  scrollView: {
    marginHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    height: "50%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  consentButton: {
    backgroundColor: "#5FBFF8",
    borderColor: "#5FBFF8",
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "12.5%",
    width: "75%",
    marginBottom: "5%",
  },
  noConsentButton: {
    backgroundColor: "#5FBFF8",
    borderColor: "#5FBFF8",
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "12.5%",
    width: "75%",
    marginBottom: "27.5%",
  },
});
