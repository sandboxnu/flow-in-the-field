import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { LIGHTPURPLE } from "../../constants/colors";
import ErrorText from "../../components/ErrorText";
import SignInFlowCustomTextInput from "../../components/TextInput/SignInFlowCustomTextInput";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { mapErrorCodeToMessage } from "../../utils/utils";

let interactor = new FirebaseInteractor()

interface SignUpPageProps {
    goToSignIn: () => void;
    goToAccountSettings: () => void;
}

export default function SignUpPage({ goToSignIn, goToAccountSettings }: SignUpPageProps) {
    const navigation = useNavigation();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/flow-icon.png")} style={styles.mainImage} />
            <SignInFlowCustomTextInput value={email} setValue={setEmail} placeholderText="Email" secureText={false} />
            <SignInFlowCustomTextInput value={password} secureText setValue={setPassword} placeholderText="Password" />
            <SignInFlowCustomTextInput value={confirmPassword} secureText setValue={setConfirmPassword} placeholderText="Re-enter Password" />
            <ErrorText message={error} />
            <TouchableOpacity onPress={() => {
                if (!email) {
                    setError("Please enter an email address.")
                } else if (!password) {
                    setError("Please enter a password.")
                } else if (!confirmPassword) {
                    setError("Please confirm your password.")
                } else if (password !== confirmPassword) {
                    setError("Passwords do not match.")
                } else {
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    goToSignIn();
                    navigation.navigate("ConsentScreen", { email: email, password: password })
                    // interactor.createAccount(email, password)
                    //     .then(() => {
                    //         setEmail("");
                    //         setPassword("");
                    //         setConfirmPassword("");
                    //         goToSignIn();
                    //     })
                    //     .catch(e => {
                    //         console.log(e.message);
                    //         setError(mapErrorCodeToMessage(e.code))
                    //     })
                }
            }} style={styles.signUpButton}>
                <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToSignIn} style={styles.loginButton}>
                <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: 'center',
        height: "100%",
        paddingTop: "15%"
    },
    signUpButton: {
        backgroundColor: LIGHTPURPLE,
        width: "85%",
        height: "5.5%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        marginTop: "5%"
    },
    signUpText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500'
    },
    loginButton: {
        margin: 11
    },
    loginText: {
        color: LIGHTPURPLE,
        fontSize: 18,
        fontWeight: '500',
        marginTop: "2%"
    },
    mainImage: {
        width: "60%",
        resizeMode: 'contain',
        maxHeight: 158,
        marginBottom: "10%"
    },
})
