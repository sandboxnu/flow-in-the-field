import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import ErrorText from "../../components/Text/ErrorText";
import MediumText from "../../components/Text/MediumText";
import SignInFlowCustomTextInput from "../../components/TextInput/SignInFlowCustomTextInput";
import { LIGHTPURPLE } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { mapErrorCodeToMessage } from "../../utils/utils";

const interactor = new FirebaseInteractor();

interface SignUpPageProps {
  goToSignIn: () => void;
  goToAccountSettings: () => void;
}

export default function SignUpPage({
  goToSignIn,
  goToAccountSettings,
}: SignUpPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      <SignInFlowCustomTextInput
        value={confirmPassword}
        secureText
        setValue={setConfirmPassword}
        placeholderText="Re-enter Password"
      />
      <ErrorText message={error} />
      <TouchableOpacity
        onPress={() => {
          if (!email) {
            setError("Please enter an email address.");
          } else if (!password) {
            setError("Please enter a password.");
          } else if (!confirmPassword) {
            setError("Please confirm your password.");
          } else if (password !== confirmPassword) {
            setError("Passwords do not match.");
          } else {
            interactor
              .createAccount(email, password)
              .then(() => {
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                goToSignIn();
              })
              .catch((e) => {
                console.log(e.message);
                setError(mapErrorCodeToMessage(e.code));
              });
          }
        }}
        style={styles.signUpButton}
      >
        <MediumText style={styles.signUpText}>Sign Up</MediumText>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSignIn} style={styles.loginButton}>
        <MediumText style={styles.loginText}>Log In</MediumText>
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
  signUpButton: {
    backgroundColor: LIGHTPURPLE,
    width: "85%",
    height: "5.5%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: "5%",
  },
  signUpText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  loginButton: {
    margin: 11,
  },
  loginText: {
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
