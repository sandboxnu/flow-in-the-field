import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { TURQUOISE } from "../common/colors";
import CustomTextInput from "../components/TextInput/CustomTextInput";
import FirebaseInteractor from "../firebase/firebaseInteractor";

let interactor = new FirebaseInteractor()

interface SignUpPageProps {
    goToSignIn: () => void;
    goToAccountSettings: () => void;
}

export default function SignUpPage({ goToSignIn, goToAccountSettings }: SignUpPageProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    return (
        <View style={styles.container}>
            <Image source={require("../assets/flow-icon.png")} style={styles.mainImage} />
            <CustomTextInput value={name} setValue={setName} placeholderText="name" secureText={false} />
            <CustomTextInput value={email} setValue={setEmail} placeholderText="email" secureText={false} />
            <CustomTextInput value={password} secureText setValue={setPassword} placeholderText="password" />
            <CustomTextInput value={confirmPassword} secureText setValue={setConfirmPassword} placeholderText="re-enter password" />
            <TouchableOpacity onPress={() => {
                if (email && password && name && password === confirmPassword) {
                    interactor.createAccount(email, password)
                        .then(goToAccountSettings)
                        .catch(console.log)
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
        color: "#4D4661"
    }
})