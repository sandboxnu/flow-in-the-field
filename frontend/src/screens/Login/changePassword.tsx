import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ErrorText from "../../components/ErrorText";
import SignInFlowCustomTextInput from "../../components/TextInput/SignInFlowCustomTextInput";
import { BLUE, LIGHTPURPLE } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { mapErrorCodeToMessage } from "../../utils/utils";

const fi = new FirebaseInteractor();
export default function ChangePasswordScreen() {
    const [currPass, setCurrPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("")
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("");
    const updatePassword = () => {
        setError("");
        setSuccessMessage("");
        if (!currPass) {
            setError("Please enter your current password.");
        } else if (!newPass) {
            setError("Please enter a new password.");
        } else if (currPass === newPass) {
            setError("New password cannot be the same as the old password.")
        } else if (newPass !== confirmPass) {
            setError("Passwords do not match.");
        } else {
            fi.updatePassword(currPass, newPass).then(() => {
                setSuccessMessage("Successfully changed password.")
                setCurrPass('')
                setNewPass('')
                setConfirmPass('')
            }).catch(e => setError(mapErrorCodeToMessage(e.code)))
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Change Password</Text>
            <SignInFlowCustomTextInput placeholderText="Current Password" value={currPass} setValue={setCurrPass} secureText />
            <SignInFlowCustomTextInput placeholderText="New Password" value={newPass} setValue={setNewPass} secureText />
            <SignInFlowCustomTextInput placeholderText="Re-type New Password" value={confirmPass} setValue={setConfirmPass} secureText />
            <TouchableOpacity style={styles.button} onPress={updatePassword}>
                <Text style={styles.buttonText}>save</Text>
            </TouchableOpacity>
            <ErrorText message={error} />
            <Text>{successMessage}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: '10%',
        alignItems: 'center'
    },
    header: {
        color: BLUE,
        fontSize: 24,
        textAlign: 'left',
        width: '85%',
        marginBottom: 20,
        fontWeight: '500'
    },
    button: {
        width: '85%',
        backgroundColor: LIGHTPURPLE,
        borderRadius: 12,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    buttonText: {
        fontSize: 21,
        color: 'white',
        textAlignVertical: 'center'
    }
})