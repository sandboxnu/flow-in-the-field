import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import TextIconButton from "../components/TextIconButton";
import FirebaseInteractor from "../firebase/firebaseInteractor";
import { User } from "../models/types";

const fi = new FirebaseInteractor();

export default function Homescreen() {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        fi.getUser().then(setUser).catch(console.error);
    }, []);

    const navigation = useNavigation();

    return (<View>
        {
            user ? <Text>{user.toString()}</Text> : <Text>Loading...</Text>
        }
        <TextIconButton onPress={() => console.log("starting session")} text="Start a new session" icon={require("../assets/flow-icon.png")} />
        <TextIconButton onPress={() => navigation.navigate("settings")} text="Profile" icon={require("../assets/flow-icon.png")} />
        <TextIconButton onPress={() => console.log("starting help")} text="Help" icon={require("../assets/flow-icon.png")} />

    </View>)
}