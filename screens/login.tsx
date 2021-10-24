import { useNavigation } from "@react-navigation/core";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import FirebaseInteractor from "../firebase/firebaseInteractor";

let interactor = new FirebaseInteractor()

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigation = useNavigation()

    return (
        <View>
            <Image source={{uri: "/flow-icon.png"}} />
            <TextInput value={email} onChangeText={setEmail}/>
            <TextInput value={password} onChangeText={setPassword}/>
            <Button title="log in" onPress={() => {
                if (email && password) {
                    interactor.signInWithUsernameAndPassword(email, password)
                    .then(console.log)
                    .catch(console.log)
                }
            }}/>
        </View>
    )
}
const styles = StyleSheet.create({
    textInput: {
        borderRadius: 1,
        color: "#4D4661",
        paddingHorizontal: 9
    }
})