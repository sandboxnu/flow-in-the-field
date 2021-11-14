import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
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

    if (!user) {
        return <Text>loading</Text>
    }

    const dayFormatter = new Intl.DateTimeFormat(undefined, { day: "numeric"} )
    const monthFormatter = new Intl.DateTimeFormat(undefined, {month: "short"})
    return (
    <View style={styles.main}>
        <Text style={styles.testDay}>
            Your test date is:
        </Text>
        <View style={styles.calendar}>
            <Text style={styles.monthNameText}>
                {monthFormatter.format(user.testDate).toLowerCase()}
            </Text>
            <View style={styles.line}/>
            <View style={styles.evenSpaced}>
                <Text style={styles.dayText}>{dayFormatter.format(user.testDate)}</Text>
            </View>
        </View>
        <TextIconButton onPress={() => console.log("starting session")} text="Start a new session" icon={require("../assets/flow-icon.png")} />
        <TextIconButton onPress={() => navigation.navigate("settings")} text="Profile" icon={require("../assets/flow-icon.png")} />
        <TextIconButton onPress={() => console.log("starting help")} text="Help" icon={require("../assets/help.png")} />

    </View>)
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendar: {
        aspectRatio: 1,
        width: "50%",
        borderColor: "#5EAFDF",
        borderWidth: 3,
        borderRadius: 31,
        alignItems: 'center',
        marginBottom: "8%"
    },
    monthNameText: {
        fontSize: 48,
        color: "#5EAFDF"
    },
    line: {
        height: 2,
        width: "100%",
        backgroundColor: "#5EAFDF"
    },
    dayText: {
        fontSize: 68,
        textAlign: 'center',
        color: "#5EAFDF"
    },
    evenSpaced: {
        flex: 1,
        justifyContent: 'center'
    },
    testDay: {
        fontSize: 36,
        color: "#5EAFDF",
        marginBottom: "5%"
    }
})