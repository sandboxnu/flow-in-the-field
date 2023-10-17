import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

import ErrorText from "../../components/ErrorText";
import SignInFlowCustomTextInput from "../../components/TextInput/SignInFlowCustomTextInput";
import { LIGHTPURPLE } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { mapErrorCodeToMessage } from "../../utils/utils";

const interactor = new FirebaseInteractor();

interface LoginProps {
  goToSignUp: () => void;
  goToRecoveryScreen: () => void;
  goToAccountSettings: () => void;
}

export default function LoginPage({
  goToSignUp,
  goToRecoveryScreen,
  goToAccountSettings,
}: LoginProps) {
  const [recruitmentId, setRecruitmentId] = useState("");
  const [error, setError] = useState("");

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/flow-icon.png")}
        style={styles.mainImage}
      />
      <SignInFlowCustomTextInput
        value={recruitmentId}
        setValue={setRecruitmentId}
        placeholderText="Recruitment ID"
        secureText={false}
      />
      <ErrorText message={error} />
      <TouchableOpacity
        onPress={() => {
          if (!recruitmentId) {
            setError("Please enter a recruitment ID.");
          } else {
            interactor
              .signInWithRecruitmentId(recruitmentId)
              .then(() => {
                setRecruitmentId("");
                setError("");
                goToAccountSettings();
              })
              .catch((e) => {
                console.log(e.message);
                setError(mapErrorCodeToMessage(e.code));
              });
          }
        }}
        style={styles.loginButton}
      >
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSignUp} style={styles.signUpButton}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goToRecoveryScreen}
        style={styles.signUpButton}
      >
        <Text style={styles.signUpText}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "#4D4661",
    paddingHorizontal: 9,
    height: 36,
    width: "60%",
    marginVertical: "4%",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 35,
    letterSpacing: 0,
    textAlign: "left",
  },
  container: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingTop: "15%",
  },
  loginButton: {
    backgroundColor: LIGHTPURPLE,
    width: "85%",
    height: "5.5%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: "5%",
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  signUpButton: {
    marginTop: 11,
  },
  signUpText: {
    color: LIGHTPURPLE,
    fontSize: 18,
    fontWeight: "500",
    marginTop: "2%",
  },
  mainImage: {
    width: "60%",
    resizeMode: "contain",
    maxHeight: 158,
    marginBottom: "10%",
  },
});
