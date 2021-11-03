import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { TURQUOISE } from "../../common/colors";
import FirebaseInteractor from "../../firebase/firebaseInteractor";

let interactor = new FirebaseInteractor()

interface SignUpPageProps {
    goToSignIn: () => void;
}

export default function SignUpPage({ goToSignIn }: SignUpPageProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/flow-icon.png")} style={styles.mainImage} />
            <TextInput placeholderTextColor="#4D4661" value={name} onChangeText={setName} style={styles.textInput} placeholder="name" />
            <TextInput placeholderTextColor="#4D4661" value={email} onChangeText={setEmail} style={styles.textInput} placeholder="email" />
            <TextInput placeholderTextColor="#4D4661" value={password} secureTextEntry onChangeText={setPassword} style={styles.textInput} placeholder="password" />
            <TextInput placeholderTextColor="#4D4661" value={confirmPassword} secureTextEntry onChangeText={setConfirmPassword} style={styles.textInput} placeholder="re-enter password" />
            <TouchableOpacity onPress={() => {
                if (email && password && name && password === confirmPassword) {
                    interactor.createAccount(email, password)
                        .then(console.log)
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
        margin: 11
    },
    signUpText: {
        color: "#4D4661"
    }
})