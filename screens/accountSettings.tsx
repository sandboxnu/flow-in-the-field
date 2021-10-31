import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomTextInput from "../components/TextInput/CustomTextInput";
import FirebaseInteractor from "../firebase/firebaseInteractor";

const fi = new FirebaseInteractor();

export default function AccountSettings() {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    return (<View style={styles.container}>
        <Text>Account Settings</Text>
        <Text>{fi.email}</Text>
        <CustomTextInput placeholderText="current password" secureText value={currentPassword} setValue={setCurrentPassword} />
        <CustomTextInput placeholderText="new password" secureText value={newPassword} setValue={setNewPassword} />
        <TouchableOpacity onPress={() => fi.updatePassword(currentPassword, newPassword).then(console.log).catch(console.log)}>
            <Text>Update Password</Text>
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