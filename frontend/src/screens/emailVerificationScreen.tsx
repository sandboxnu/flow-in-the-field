import FirebaseInteractor from "../firebase/firebaseInteractor";
import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, Linking, Platform } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { BLUE, GREY, ORANGE, PURPLE, TURQUOISE } from "../constants/colors";
import ErrorText from "../components/ErrorText";
import { startActivityAsync } from "expo-intent-launcher";


const fi = new FirebaseInteractor();



export default function EmailVerificationScreen() {

    const navigation = useNavigation();
    const [errorMessage, setErrorMessage] = useState<string>();

    return (<View style={styles.container}>
        <View style={styles.containedContainer}>
            <Image source={require("../assets/flow-icon.png")} style={styles.mainImage} />
            <Text style={styles.promptText}>A verification link was sent to your email. This helps us protect your account, so that only you can access it.</Text>

        </View>
        <View style={styles.containedContainer}>
            <ErrorText message={errorMessage} />
            <TouchableOpacity style={styles.resendButton} onPress={async () => {
                await fi.resendEmailVerification();
            }}>
                <Text style={styles.resendText}>resend verification email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.verifiedButton} onPress={() => {
                fi.checkIfVerified().then(emailVerified => {
                    if (emailVerified) {
                        navigation.navigate("HomeScreen")
                    } else {
                        setErrorMessage("Email has not been verified. Please check your email.")
                    }
                }).catch(e => {
                    setErrorMessage("Something went wrong. Please try again later.");
                    console.log(e)
                })
            }}>
                <Text style={styles.verifiedText}>I have verified my email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mailButton} onPress={() => {
                if (Platform.OS === "ios") {
                    Linking.openURL("message://")
                } else {
                    startActivityAsync("android.intent.action.MAIN",
                        {
                            category: "android.intent.category.APP_EMAIL",
                            flags: 268435456
                        })
                    // Linking.sendIntent("android.intent.action.MAIN", [
                    //     { key: "category", value: "android.intent.category.APP_EMAIL" },
                    //     { key: "flags", value: "FLAG_ACTIVITY_NEW_TASK" }])
                }
            }}>
                <Text style={styles.mailText}>open mail</Text>
            </TouchableOpacity>
        </View>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        paddingVertical: "10%",
        justifyContent: "space-between"
    },

    containedContainer: {
        width: "100%",
        height: "85%",
        alignItems: "center"
    },

    mainImage: {
        width: "60%",
        resizeMode: 'contain',
        maxHeight: "25%",
        marginBottom: "10%"
    },

    promptText: {
        textAlign: "center",
        marginHorizontal: "10%",
        fontSize: 18,
        color: BLUE,
        fontWeight: "600"
    },

    resendButton: {
        width: "100%",
        paddingVertical: "1%"
    },

    resendText: {
        fontSize: 18,
        color: PURPLE,
        textAlign: "center",
        textDecorationLine: "underline",
        fontWeight: "300",
    },

    verifiedButton: {
        width: "80%",
        margin: "2%",
        backgroundColor: TURQUOISE,
        borderRadius: 10000000,
    },

    verifiedText: {
        color: "white",
        fontSize: 18,
        fontWeight: '400',
        width: "100%",
        textAlign: "center",
        paddingVertical: 15
    },

    mailButton: {
        width: "100%",
        paddingVertical: "1%"
    },

    mailText: {
        fontSize: 18,
        color: PURPLE,
        textAlign: "center",
        textDecorationLine: "underline",
        fontWeight: "300",
    }
})