import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FirebaseInteractor from "../firebase/firebaseInteractor";
import { useNavigation } from "@react-navigation/core";
import { mapErrorCodeToMessage } from "../utils/utils";

const CONSENT_HEADER_OPTIONS = {
    headerTitle: () => { return <Image style={styles.mainImage} source={require('../assets/flow-icon-light.png')} /> },
    title: '',
    headerTitleAlign: "center" as "center",
    headerShadowVisible: false,
    headerTintColor: '#D16B50',
    headerBackTitle: '',
    headerStyle: {
        backgroundColor: '#6E81E7',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
    }
}

const fi = new FirebaseInteractor();

export interface ConsentScreenProps {
    route: any;
    email: string;
    password: string;
}

export default function ConsentScreen(props: ConsentScreenProps) {

    const navigation = useNavigation();
    const [error, setError] = useState("")

    React.useLayoutEffect(() => {
        navigation.setOptions(CONSENT_HEADER_OPTIONS);
    }, [navigation]);

    const consentGiven = () => {
        console.log("email", props.email)
        console.log("password", props.password)
        fi.createAccount(props.email, props.password)
            .then(() => {
                navigation.navigate("EmailVerification")
            })
            .catch(e => {
                console.log(e.message);
                setError(mapErrorCodeToMessage(e.code))
            })

    }

    return (
        <View style={styles.container}>
            <Text style={{ color: "#FFF", fontSize: 20 }}>
                consent text here blah blah blah more text here
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={consentGiven}>
                <Text style={{ color: "#FFF", fontSize: 22 }}>I consent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("EmailVerification")}>
                <Text style={{ color: "#FFF", fontSize: 22 }}>I do not consent</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainImage: {
        width: 94,
        resizeMode: 'contain',
        height: 51
    },
    container: {
        flexDirection: "column",
        flex: 1,
        backgroundColor: '#6E81E7',
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
        height: "100%",
        paddingTop: "5%"
    },
    startButton: {
        backgroundColor: "#5FBFF8",
        borderColor: "#5FBFF8",
        borderWidth: 2,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        height: '7.5%',
        width: '75%',
    }
})
