import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { PURPLE, TURQUOISE } from "../../constants/colors";
import ErrorText from "../../components/ErrorText";
import CustomTextInput from "../../components/TextInput/CustomTextInput";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { mapErrorCodeToMessage } from "../../utils/utils";

let interactor = new FirebaseInteractor()

interface SignUpPageProps {
    goToSignIn: () => void;
    goToAccountSettings: () => void;
}

export default function SignUpPage({ goToSignIn, goToAccountSettings }: SignUpPageProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/flow-icon.png")} style={styles.mainImage} />
            <CustomTextInput value={email} setValue={setEmail} placeholderText="email" secureText={false} />
            <CustomTextInput value={password} secureText setValue={setPassword} placeholderText="password" />
            <CustomTextInput value={confirmPassword} secureText setValue={setConfirmPassword} placeholderText="re-enter password" />
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
                    interactor.createAccount(email, password)
                        .then(goToAccountSettings)
                        .catch(e => {
                            console.log(e.message);
                            setError(mapErrorCodeToMessage(e.code))
                        })
                }
            }} style={styles.loginButton}>
                <Text style={styles.loginText}>sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToSignIn} style={styles.signUpButton}>
                <Text style={styles.signUpText}>log in</Text>
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
    loginButton: {
        backgroundColor: TURQUOISE,
        borderRadius: 8,
        marginTop: 5
    },
    loginText: {
        color: 'white',
        paddingHorizontal: 20,
        paddingVertical: 3,
        fontSize: 18,
        fontWeight: '400'
    },
    mainImage: {
        width: "60%",
        resizeMode: 'contain',
        maxHeight: 158,
        marginBottom: "10%"
    },
    signUpButton: {
        margin: 11
    },
    signUpText: {
        color: PURPLE,
        textDecorationLine: "underline",
        fontSize: 18

    }
})