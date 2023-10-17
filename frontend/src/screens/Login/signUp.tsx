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

interface SignUpPageProps {
  goToSignIn: () => void;
  goToAccountSettings: () => void;
}

export default function SignUpPage({
  goToSignIn,
  goToAccountSettings,
}: SignUpPageProps) {
  const [recruitmentId, setRecruitmentId] = useState("");
  const [confirmId, setConfirmId] = useState("");
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
      <SignInFlowCustomTextInput
        value={confirmId}
        setValue={setConfirmId}
        placeholderText="Confirm Recruitment ID"
        secureText={false}
      />
      <ErrorText message={error} />
      <TouchableOpacity
        onPress={() => {
          if (!recruitmentId) {
            setError("Please enter a recruitment ID.");
          } else if (!confirmId) {
            setError("Please confirm your recruitment ID.");
          } else if (recruitmentId !== confirmId) {
            setError("The IDs do not match.");
          } else {
            interactor
              .createUserWithRecruitmentID(recruitmentId)
              .then(() => {
                setRecruitmentId("");
                setConfirmId("");
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
        <Text style={styles.signUpText}>Sign Up</Text>
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
