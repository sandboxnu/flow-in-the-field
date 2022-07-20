import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import ErrorText from "../../components/Text/ErrorText";
import MediumText from "../../components/Text/MediumText";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/flow-icon.png")}
        style={styles.mainImage}
      />
      <SignInFlowCustomTextInput
        value={email}
        setValue={setEmail}
        placeholderText="Email"
        secureText={false}
      />
      <SignInFlowCustomTextInput
        value={password}
        secureText
        setValue={setPassword}
        placeholderText="Password"
      />
      <ErrorText message={error} />
      <TouchableOpacity
        onPress={() => {
          if (!email) {
            setError("Please enter an email address.");
          } else if (!password) {
            setError("Please enter a password.");
          } else {
            interactor
              .signInWithUsernameAndPassword(email, password)
              .then(() => {
                setEmail("");
                setPassword("");
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
        <MediumText style={styles.loginText}>Log In</MediumText>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSignUp} style={styles.signUpButton}>
        <MediumText style={styles.signUpText}>Sign Up</MediumText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goToRecoveryScreen}
        style={styles.signUpButton}
      >
        <MediumText style={styles.signUpText}>Forgot Password</MediumText>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
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
