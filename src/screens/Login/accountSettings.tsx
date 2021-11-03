import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomTextInput from "../../components/TextInput/CustomTextInput";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import ErrorText from "../../components/ErrorText";
import { mapErrorCodeToMessage } from "../../utils/utils";

const fi = new FirebaseInteractor();

interface AccountSettingsProps {
    goToSignupPage: () => void;
}

export default function AccountSettings({ goToSignupPage }: AccountSettingsProps) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccesMessage] = useState("")

    return (<View style={styles.container}>
        <Text>Account Settings</Text>
        <Text>{fi.email}</Text>
        <CustomTextInput placeholderText="current password" secureText value={currentPassword} setValue={setCurrentPassword} />
        <CustomTextInput placeholderText="new password" secureText value={newPassword} setValue={setNewPassword} />
        <ErrorText message={error} />
        <Text>{successMessage}</Text>
        <TouchableOpacity onPress={() => {
            if (!currentPassword) {
                setError("Please enter your current password.");
            } else if (!newPassword) {
                setError("Please enter a new password.");
            } else if (currentPassword === newPassword) {
                setError("New password cannot be the same as the old passowrd.")
            } else {
                fi.updatePassword(currentPassword, newPassword).then(() => {
                    setSuccesMessage("Successfully changed password.")
                }).catch(e => setError(mapErrorCodeToMessage(e.code)))
            }
        }}>
            <Text>Update Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>
            fi.logout().then(goToSignupPage).catch(e => setError(mapErrorCodeToMessage(e.code)))}>
            <Text>Logout</Text>
        </TouchableOpacity>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
        height: "100%",
        paddingTop: "15%"
    }
});