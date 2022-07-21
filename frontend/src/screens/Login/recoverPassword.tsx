import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { LIGHTPURPLE } from "../../constants/colors";
import SignInFlowCustomTextInput from "../../components/TextInput/SignInFlowCustomTextInput";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import ErrorText from "../../components/ErrorText";
import { mapErrorCodeToMessage } from "../../utils/utils";

let interactor = new FirebaseInteractor()

interface RecoveryPasswordProps {
    goToSignIn: () => void
}

export default function RecoverPasswordPage({ goToSignIn }: RecoveryPasswordProps) {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/flow-icon.png")} style={styles.mainImage} />
            <SignInFlowCustomTextInput value={email} setValue={setEmail} placeholderText="Email" secureText={false} />
            <ErrorText message={error} />
            <TouchableOpacity onPress={() => {
                if (!email) {
                    setError("Please enter an email address.")
                } else {
                    interactor.resetPassword(email).catch(e => {
                        setError(mapErrorCodeToMessage(e.code))
                    }).then(() => {
                        goToSignIn();
                    });
                }
            }} style={styles.recoverPasswordButton}>
                <Text style={styles.recoverPasswordText}>Recover Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToSignIn} style={styles.loginButton}>
                <Text style={styles.loginText}>Log In</Text>
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
    recoverPasswordButton: {
        backgroundColor: LIGHTPURPLE,
        width: "85%",
        height: "5.5%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        marginTop: "5%"
    },
    recoverPasswordText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500'
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
        color: LIGHTPURPLE,
        fontSize: 18,
        fontWeight: '500',
        marginTop: "2%"
    }
})
