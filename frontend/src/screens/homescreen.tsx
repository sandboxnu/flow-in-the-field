import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";

import TextIconButton from "../components/Button/TextIconButton";
import { LoadingScreen } from "../components/LoadingScreen";
import BoldText from "../components/Text/BoldText";
import MediumText from "../components/Text/MediumText";
import { Role } from "../constants/role";
import FirebaseInteractor from "../firebase/firebaseInteractor";
import { User, UID } from "../models/types";
import "intl";
import "intl/locale-data/jsonp/en";
import { GameStateContext } from "../utils/context";

const fi = new FirebaseInteractor();

export interface HomescreenProps {
  route: any;
}

export default function Homescreen(props: HomescreenProps) {
  const [user, setUser] = useState<User>();
  const testFinished = props.route.params
    ? props.route.params["testFinished"]
    : false;
  const gameStateContext = useContext(GameStateContext);

  useEffect(() => {
    fi.getUser()
      .then((user) => setUser(user))
      .catch(console.error);
  }, []);

  const navigation = useNavigation();

  if (!user) {
    return <LoadingScreen />;
  }

  const startSession = () => {
    fi.startSession().then((sessionId: UID) => {
      gameStateContext.updateSessionId(sessionId);
      navigation.navigate("GameScreen", { sessionId });
    });
  };

  const hasFinishedTest = () => {
    return testFinished || user.testScore != null;
  };

  const testAvailable = () => {
    const now = new Date(Date.now());
    const timeUntilTest = user.testDate.getTime() - now.getTime();

    return !hasFinishedTest() && timeUntilTest <= 0;
  };

  const startTest = () => {
    if (testAvailable()) {
      navigation.navigate("TestWelcomeScreen");
    }
  };

  const dayFormatter = new Intl.DateTimeFormat(undefined, { day: "numeric" });
  const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "short" });

  return (
    <View style={styles.main}>
      <ImageBackground
        style={styles.backgroundImageBox}
        source={require("../assets/lines.png")}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.testDayBox}>
          <MediumText style={styles.testDayHeader}>
            Your test date is:
          </MediumText>
          <BoldText style={styles.testDay}>
            {monthFormatter.format(user.testDate) +
              " " +
              dayFormatter.format(user.testDate)}
          </BoldText>
        </View>
      </ImageBackground>
      <View style={styles.buttonBox}>
        <TextIconButton
          onPress={() => startSession()}
          text="Start a new session"
          icon={require("../assets/start-session-icon.png")}
        />
        <TextIconButton
          onPress={() => startTest()}
          text="Take the test"
          icon={require("../assets/flow-icon-test.png")}
          testNotAvailable={!testAvailable()}
        />
        {user.role === Role.ADMIN && (
          <TextIconButton
            onPress={() => navigation.navigate("AdminScreen")}
            text="Admin"
            icon={require("../assets/admin-icon.png")}
          />
        )}
        <TextIconButton
          onPress={() => navigation.navigate("SettingsScreen")}
          text="Settings"
          icon={require("../assets/settings-icon.png")}
        />
        <TextIconButton
          onPress={() =>
            navigation.navigate("RevisitOnboarding", { signedIn: true })
          }
          text="About"
          icon={require("../assets/about-icon.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-evenly",
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  calendar: {
    aspectRatio: 1,
    width: "50%",
    borderColor: "#5EAFDF",
    borderWidth: 3,
    borderRadius: 31,
    alignItems: "center",
    marginBottom: "8%",
  },
  monthNameText: {
    fontSize: 48,
    color: "#5EAFDF",
  },
  line: {
    height: 2,
    width: "100%",
    backgroundColor: "#5EAFDF",
  },
  dayText: {
    fontSize: 68,
    textAlign: "center",
    color: "#5EAFDF",
  },
  evenSpaced: {
    flex: 1,
    justifyContent: "center",
  },
  testDay: {
    fontSize: 50,
    color: "#5EAFDF",
    paddingTop: "3%",
    alignSelf: "center",
  },
  testDayHeader: {
    fontSize: 30,
    color: "#D16B50",
    marginLeft: "7%",
    alignSelf: "flex-start",
  },
  testDayBox: {
    justifyContent: "center",
    paddingBottom: "12%",
  },
  backgroundImageBox: {
    width: "100%",
    height: "30%",
    justifyContent: "center",
  },
  backgroundImage: {
    resizeMode: "stretch",
    width: "100%",
    height: "100%",
  },
  buttonBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
});
