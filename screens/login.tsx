import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { TURQUOISE } from "../common/colors";
import FirebaseInteractor from "../firebase/firebaseInteractor";

let interactor = new FirebaseInteractor()

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Image source={require("../assets/flow-icon.png")} style={styles.mainImage} />
            <TextInput value={email} onChangeText={setEmail} style={styles.textInput} placeholder="email"/>
            <TextInput value={password} onChangeText={setPassword} style={styles.textInput} placeholder="password"/>
            <TouchableOpacity onPress={() => {
                if (email && password) {
                    interactor.signInWithUsernameAndPassword(email, password)
                    .then(console.log)
                    .catch(console.log)
                }
            }} style={styles.loginButton}>
                <Text style={styles.loginText}>log in</Text>
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
        marginVertical: 17
    },
    container: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%"
    },
    loginButton: {
        backgroundColor: TURQUOISE,
        borderRadius: 8
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
        maxHeight: 158
    }
})