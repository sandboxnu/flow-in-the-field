import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { TURQUOISE } from "../common/colors";
import FirebaseInteractor from "../firebase/firebaseInteractor";

let interactor = new FirebaseInteractor()

interface LoginProps {
    goToSignUp: () => void;
    goToRecoveryScreen: () => void;
}

export default function LoginPage({ goToSignUp, goToRecoveryScreen }: LoginProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <View style={styles.container}>
            <Image source={require("../assets/flow-icon.png")} style={styles.mainImage} />
            <TextInput placeholderTextColor="#4D4661" value={email} onChangeText={setEmail} style={styles.textInput} placeholder="email" />
            <TextInput placeholderTextColor="#4D4661" value={password} secureTextEntry onChangeText={setPassword} style={styles.textInput} placeholder="password" />
            <TouchableOpacity onPress={() => {
                if (email && password) {
                    interactor.signInWithUsernameAndPassword(email, password)
                        .then(console.log)
                        .catch(console.log)
                }
            }} style={styles.loginButton}>
                <Text style={styles.loginText}>log in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToSignUp} style={styles.signUpButton}>
                <Text style={styles.signUpText}>sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToRecoveryScreen} style={styles.signUpButton}>
                <Text style={styles.signUpText}>forgot password</Text>
            </TouchableOpacity>
        </View>
    )
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
        textAlign: "left"
    },
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
        marginTop: 11
    },
    signUpText: {
        color: "#4D4661"
    }
})