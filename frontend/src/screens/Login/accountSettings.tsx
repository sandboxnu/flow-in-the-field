import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import CustomTextInput from "../../components/TextInput/CustomTextInput";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import ErrorText from "../../components/ErrorText";
import { mapErrorCodeToMessage } from "../../utils/utils";
import { useNavigation } from "@react-navigation/core";
import { BLUE, ORANGE, PURPLE } from "../../constants/colors";

const fi = new FirebaseInteractor();

export default function AccountSettings() {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [emailScrollPos, setEmailScrollPos] = useState(0);

    const navigation = useNavigation();

    const updatePassword: Function = (): void => {
        setError("");
        setSuccessMessage("");
        if (!currentPassword) {
            setError("Please enter your current password.");
        } else if (!newPassword) {
            setError("Please enter a new password.");
        } else if (currentPassword === newPassword) {
            setError("New password cannot be the same as the old password.")
        } else {
            fi.updatePassword(currentPassword, newPassword).then(() => {
                setSuccessMessage("Successfully changed password.")
            }).catch(e => setError(mapErrorCodeToMessage(e.code)))
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.half}>
                <Text style={styles.header}>Account Settings</Text>
                <View style={styles.horizontalScroller}>
                    <Text style={styles.paragraph}>email: </Text>
                    <ScrollView
                        style={styles.horizontalScrollerSubject}
                        onScroll={(event) => { setEmailScrollPos(event.nativeEvent.contentOffset.x) }}
                        horizontal>
                        <Text
                            numberOfLines={1}
                            style={[styles.paragraph, { maxWidth: `${emailScrollPos > 0 ? "9999%" : "100%"}` }]}>
                            {fi.email}
                        </Text>
                    </ScrollView>
                </View>
                <CustomTextInput
                    value={currentPassword}
                    setValue={setCurrentPassword}
                    secureText
                    placeholderText="current password"
                    width="100%" />
                <CustomTextInput
                    value={newPassword}
                    setValue={setNewPassword}
                    secureText
                    placeholderText="new password"
                    width="100%" />
                <ErrorText message={error} />
                <Text>{successMessage}</Text>
                <TouchableOpacity style={styles.button} onPress={() => updatePassword()}>
                    <Text style={styles.buttonText}>change password</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    fi.logout().then(() => {
                        navigation.navigate("SignInFlow");
                    });
                }} style={styles.logOutButton}>
                    <Text style={styles.logOutText}>log out</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.half}>
                <Text style={styles.subheader}>contact us!</Text>
                <Text style={styles.paragraph}>email: xxxx@gmail.com</Text>
                <Text style={styles.paragraph}>phone: (123)-456-7890</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        justifyContent: 'center',
        alignItems: "center",
        paddingTop: "4%",
        paddingBottom: "4%",
        backgroundColor: "#FFF"
    },
    half: {
        flex: 1,
        height: "50%",
        width: "100%",
        justifyContent: 'center',
        alignItems: "center",
        padding: 64
    },
    header: {
        fontSize: 32,
        color: BLUE,
        marginBottom: 16,
        fontFamily: "Montserrat_700Bold"
    },
    horizontalScroller: {
        flexDirection: "row",
    },
    horizontalScrollerSubject: {
        minHeight: 36
    },
    paragraph: {
        fontSize: 18,
        color: BLUE,
        marginBottom: 8,
        fontFamily: 'Montserrat_400Regular'
    },
    subheader: {
        fontSize: 18,
        color: BLUE,
        fontWeight: "600",
        marginBottom: 16,
        fontFamily: 'Montserrat_400Regular'
    },
    button: {
        backgroundColor: ORANGE,
        borderRadius: 12,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 6
    },
    buttonText: {
        color: 'white',
        paddingHorizontal: 20,
        paddingVertical: 3,
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'Montserrat_500Medium'
    },
    logOutButton: {
        marginTop: 11,
    },
    logOutText: {
        textDecorationLine: "underline",
        color: PURPLE,
        fontSize: 18,
        fontFamily: 'Montserrat_500Medium'
    },
});
