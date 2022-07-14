import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ErrorText from "../../components/ErrorText";
import SignInFlowCustomTextInput from "../../components/TextInput/SignInFlowCustomTextInput";
import { LIGHTPURPLE } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/FirebaseInteractor";
import { mapErrorCodeToMessage } from "../../utils/utils";

const interactor = new FirebaseInteractor();

interface RecoveryPasswordProps {
  goToSignIn: () => void;
}

export default function RecoverPasswordPage({
  goToSignIn,
}: RecoveryPasswordProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logos/flow-icon.png")}
        style={styles.mainImage}
      />
      <SignInFlowCustomTextInput
        value={email}
        setValue={setEmail}
        placeholderText="Email"
        secureText={false}
      />
      <ErrorText message={error} />
      <TouchableOpacity
        onPress={() => {
          if (!email) {
            setError("Please enter an email address.");
          } else {
            interactor
              .resetPassword(email)
              .catch((e) => {
                setError(mapErrorCodeToMessage(e.code));
              })
              .then(() => {
                goToSignIn();
              });
          }
        }}
        style={styles.recoverPasswordButton}
      >
        <Text style={styles.recoverPasswordText}>Recover Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSignIn} style={styles.loginButton}>
        <Text style={styles.loginText}>Log In</Text>
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
  recoverPasswordButton: {
    backgroundColor: LIGHTPURPLE,
    width: "85%",
    height: "5.5%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: "5%",
  },
  recoverPasswordText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  mainImage: {
    width: "60%",
    resizeMode: "contain",
    maxHeight: 158,
    marginBottom: "10%",
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
});
