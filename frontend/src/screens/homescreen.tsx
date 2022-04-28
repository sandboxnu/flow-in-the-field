import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import TextIconButton from "../components/Button/TextIconButton";
import FirebaseInteractor from "../firebase/firebaseInteractor";
import { User, UID } from "../models/types";

import "intl";
import 'intl/locale-data/jsonp/en';
import { LoadingScreen } from "../components/LoadingScreen";
import { GameStateContext } from "../utils/context";
import { Role } from "../constants/role";
import PrimaryButton from "../components/Button/PrimaryButton";

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
            gameStateContext.updateSessionId(sessionId);
            navigation.navigate("GameScreen", { sessionId: sessionId });
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
            <ImageBackground style={styles.backgroundImageBox} source={require("../assets/lines.png")} imageStyle={styles.backgroundImage}>
                <View style={styles.testDayBox}>
                    <Text style={styles.testDayHeader}>
                        Your test date is:
                    </Text>
                    <Text style={styles.testDay}>
                        {monthFormatter.format(user.testDate) + " " + dayFormatter.format(user.testDate)}
                    </Text>
                </View>
            </ImageBackground>
            <TextIconButton onPress={() => startSession()} text="Start a new session" icon={require("../assets/start-session-icon.png")} />
            <TextIconButton onPress={() => startTest()} text="Take the test" icon={require("../assets/flow-icon-test.png")} testNotAvailable={!testAvailable()} />
            {user.role == Role.ADMIN ? <PrimaryButton onPress={() => navigation.navigate("AdminScreen")} text="Admin" disabled={false} /> : <View />}
            <TextIconButton onPress={() => navigation.navigate("SettingsScreen")} text="Settings" icon={require("../assets/settings-icon.png")} />
            <TextIconButton onPress={() => navigation.navigate("RevisitOnboarding", { signedIn: true })} text="About" icon={require("../assets/about-icon.png")} />
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
        fontSize: 50,
        color: "#5EAFDF",
        paddingTop: "3%",
        alignSelf: "center"
    },
    testDayHeader: {
        fontSize: 30,
        color: "#D16B50",
        marginLeft: "7%",
        alignSelf: "flex-start"
    },
    testDayBox: {
        justifyContent: "center",
        paddingBottom: "12%"
    },
    backgroundImageBox: {
        width: "100%",
        height: "50%",
        justifyContent: "center"
    },
    backgroundImage: {
        resizeMode: "contain",
        width: "100%",
        height: "100%",
    }
})