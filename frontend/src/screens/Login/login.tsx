import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { PURPLE, TURQUOISE } from "../../constants/colors";
import ErrorText from "../../components/ErrorText";
import CustomTextInput from "../../components/TextInput/CustomTextInput";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { mapErrorCodeToMessage } from "../../utils/utils";

let interactor = new FirebaseInteractor()

interface LoginProps {
    goToSignUp: () => void;
    goToRecoveryScreen: () => void;
    goToAccountSettings: () => void;
}

export default function LoginPage({ goToSignUp, goToRecoveryScreen, goToAccountSettings }: LoginProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/flow-icon.png")} style={styles.mainImage} />
            <CustomTextInput value={email} setValue={setEmail} placeholderText="email" secureText={false} />
            <CustomTextInput value={password} secureText setValue={setPassword} placeholderText="password" />
            <ErrorText message={error} />
            <TouchableOpacity onPress={() => {
                if (!email) {
                    setError("Please enter an email address.")
                } else if (!password) {
                    setError("Please enter a password.")
                } else {
                    interactor.signInWithUsernameAndPassword(email, password)
                        .then(() => {
                            setEmail("");
                            setPassword("");
                            setError("");
                            goToAccountSettings();
                        })
                        .catch(e => {
                            console.log(e.message);
                            setError(mapErrorCodeToMessage(e.code))
                        });
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
        paddingVertical: 4,
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'Montserrat_500Medium'
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
        textDecorationLine: "underline",
        color: PURPLE,
        fontSize: 18,
        fontFamily: 'Montserrat_500Medium'
    },
})
