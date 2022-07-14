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
  const [copyScrollPos, setCopyScrollPos] = useState(0);
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
          <Text style={{ color: "#FFF", fontSize: 20 }}>
            {/* Lorem ipsum dolor sit amet. Est tempore nostrum sed porro minima ab assumenda error et voluptatibus nihil et enim eius. Et nobis sequi qui vitae eligendi eos magnam temporibus ea veritatis officia? In quasi adipisci facere quasi sed iusto autem. Id laboriosam earum id sint nisi et corporis suscipit ut sunt cupiditate. Est voluptas dicta et facilis assumenda et voluptatem quisquam et voluptas voluptates qui fuga facilis ut sequi voluptas At Quis deserunt. Sed accusamus nihil rem quia itaque sit maiores quia aut rerum modi ea perspiciatis nostrum aut dolorem dignissimos aut aspernatur distinctio! Et nisi facere qui totam eligendi aut omnis ratione quo labore laborum eum accusantium rerum. Et quia quae in voluptate velit ad animi dolore et earum voluptas ab aliquid iste ea voluptatibus suscipit et corporis consequatur. Aut numquam harum non deleniti placeat et alias autem vel ipsum molestias est voluptatem delectus qui fuga labore. Sit incidunt dignissimos et sint quisquam aut magni accusantium a nemo sint. Ad eligendi expedita et iusto assumenda est quis magnam sed inventore inventore quo suscipit minima est obcaecati saepe. */}
            {consentText}
          </Text>
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
