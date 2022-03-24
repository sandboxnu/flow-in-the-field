import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import TextIconButton from "../components/Button/TextIconButton";
import SmallTextIconButton from "../components/Button/SmallTextIconButton";
import FirebaseInteractor from "../firebase/firebaseInteractor";
import { User, UID } from "../models/types";

import "intl";
import 'intl/locale-data/jsonp/en';
import { LoadingScreen } from "../components/LoadingScreen";
import { GameStateContext } from "../utils/context";

const fi = new FirebaseInteractor();

export default function Homescreen() {
    const [user, setUser] = useState<User>();
    const gameStateContext = useContext(GameStateContext);

    useEffect(() => {
        fi.getUser().then(setUser).catch(console.error);
    }, []);

    const navigation = useNavigation();

    if (!user) {
        return <LoadingScreen />
    }

    const startSession = () => {
        fi.startSession().then((sessionId: UID) => {
            navigation.navigate("GameScreen", { sessionId: sessionId });
            gameStateContext.updateSessionId(sessionId);
        })
    }

    const testAvailable = () => {
        let now = new Date(Date.now());
        let timeUntilTest = user.testDate.getTime() - now.getTime();

        return timeUntilTest <= 0;
    }

    const startTest = () => {
        if (testAvailable()) {
            navigation.navigate("TestScreen");
        }
    }

    const dayFormatter = new Intl.DateTimeFormat(undefined, { day: "numeric" })
    const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "short" })
    return (
        <View style={styles.main}>
            <Text style={styles.testDay}>
                Your test date is:
            </Text>
            <View style={styles.calendar}>
                <Text style={styles.monthNameText}>
                    {monthFormatter.format(user.testDate).toLowerCase()}
                </Text>
                <View style={styles.line} />
                <View style={styles.evenSpaced}>
                    <Text style={styles.dayText}>{dayFormatter.format(user.testDate)}</Text>
                </View>
            </View>
            <TextIconButton onPress={() => startSession()} text="Start a new session" icon={require("../assets/start-session-icon.png")} />
            <TextIconButton onPress={() => startTest()} text="Take the test" icon={require("../assets/flow-icon-test.png")} testNotAvailable={!testAvailable()} />
            <View style={{ flexDirection: "row" }}>
                <SmallTextIconButton onPress={() => navigation.navigate("SettingsScreen")} text="Profile" icon={require("../assets/profile-icon.png")} />
                <SmallTextIconButton onPress={() => navigation.navigate("RevisitOnboarding", { signedIn: true })} text="Help" icon={require("../assets/help-icon.png")} />
            </View>
        </View>)
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
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