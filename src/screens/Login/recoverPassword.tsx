import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { TURQUOISE } from "../../constants/colors";
import CustomTextInput from "../../components/TextInput/CustomTextInput";
import FirebaseInteractor from "../../firebase/firebaseInteractor";

let interactor = new FirebaseInteractor()

interface RecoveryPasswordProps {
    goToSignIn: () => void
}

export default function RecoverPasswordPage({ goToSignIn }: RecoveryPasswordProps) {
    const [email, setEmail] = useState("")

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/flow-icon.png")} style={styles.mainImage} />
            <CustomTextInput value={email} setValue={setEmail} placeholderText="email" secureText={false} />
            <TouchableOpacity onPress={() => {
                interactor.resetPassword(email).catch(console.log).then(console.log)
            }} style={styles.recoveryPasswordButton}>
                <Text style={styles.recoverPasswordText}>recover password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToSignIn} style={styles.loginButton}>
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
    recoveryPasswordButton: {
        backgroundColor: TURQUOISE,
        borderRadius: 8,
        marginTop: 5
    },
    recoverPasswordText: {
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
    loginButton: {
        margin: 11
    },
    loginText: {
        color: "#4D4661"
    }
})