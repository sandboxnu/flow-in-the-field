import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { PURPLE, TURQUOISE } from "../../constants/colors";
import CustomTextInput from "../../components/TextInput/CustomTextInput";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import ErrorText from "../../components/Text/ErrorText";
import { mapErrorCodeToMessage } from "../../utils/utils";
import MediumText from "../../components/Text/MediumText";

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
            <CustomTextInput value={email} setValue={setEmail} placeholderText="email" secureText={false} />
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
            }} style={styles.recoveryPasswordButton}>
                <MediumText style={styles.recoverPasswordText}>recover password</MediumText>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToSignIn} style={styles.loginButton}>
                <MediumText style={styles.loginText}>log in</MediumText>
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
        paddingVertical: 4,
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
        color: PURPLE,
        textDecorationLine: "underline",
        fontSize: 18
    }
})
