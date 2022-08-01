import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";

import PrimaryButton from "../components/Button/PrimaryButton";
import BoldText from "../components/Text/BoldText";
import ErrorText from "../components/Text/ErrorText";
import RegularText from "../components/Text/RegularText";
import { REGULAR_FONT } from "../constants/fonts";
import {
  generateRoundsCSV,
  generateTestRoundsCSV,
  promptExportEmail,
} from "../firebase/csvExporter";
import FirebaseInteractor from "../firebase/firebaseInteractor";

const fi = new FirebaseInteractor();

export interface AdminScreenProps {
  route: any;
}

export default function AdminScreen(props: AdminScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setError] = useState<string | undefined>(undefined);
  const [consentText, setConsentText] = useState("");
  const [keyboardShow, setKeyboardShow] = useState(false);
  const scrollViewRef = useRef<any>();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardShow(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardShow(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (keyboardShow && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [keyboardShow]);

  useEffect(() => {
    fi.getConsentText().then((text) => {
      setConsentText(text);
    });
  }, []);

  const saveConsentText = () => {
    fi.setConsentText(consentText);
  };

  async function tryExport(func: () => Promise<object[]>) {
    setIsLoading(true);
    setError(undefined);
    try {
      await promptExportEmail(await func());
    } catch (e: any) {
      setError(
        "There was a problem while exporting. There might be faulty data, or there is something wrong with your network connection. Error: " +
          e.toString()
      );
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.view} ref={scrollViewRef}>
        <RegularText>
          Press the buttons below to export data as an email with a CSV
          attachment.
        </RegularText>

        <BoldText style={styles.header}>Practice Data</BoldText>

        <View style={styles.paragraph}>
          <RegularText>
            The Practice Data CSV will contain the following information for all
            practice rounds played by participants:
          </RegularText>
          <RegularText> • User ID</RegularText>
          <RegularText> • Game Type</RegularText>
          <RegularText> • Number of Turkish Words</RegularText>
          <RegularText> • Session ID</RegularText>
          <RegularText> • Round ID</RegularText>
          <RegularText> • Start Time</RegularText>
          <RegularText> • Duration</RegularText>
          <RegularText> • Score</RegularText>
        </View>

        <PrimaryButton
          onPress={async () => {
            await tryExport(generateRoundsCSV);
          }}
          disabled={isLoading}
          text="Export Practice CSV"
          style={styles.button}
        />

        <BoldText style={styles.header}>Test Data</BoldText>

        <View style={styles.paragraph}>
          <RegularText>
            The Test Data CSV will contain the following information for all
            test questions answered by participants:
          </RegularText>
          <RegularText> • Participant ID</RegularText>
          <RegularText> • Game Type</RegularText>
          <RegularText> • Test Session ID</RegularText>
          <RegularText> • Question Number</RegularText>
          <RegularText> • Start Time</RegularText>
          <RegularText> • End Time</RegularText>
          <RegularText> • Duration</RegularText>
          <RegularText> • Answer</RegularText>
          <RegularText> • Correctness</RegularText>
        </View>

        <PrimaryButton
          onPress={async () => {
            await tryExport(generateTestRoundsCSV);
          }}
          disabled={isLoading}
          text="Export Test CSV"
          style={styles.button}
        />
        <View style={styles.error}>
          <ErrorText message={errorState} />
        </View>

        <BoldText style={styles.header}>Edit Consent Form</BoldText>

        <RegularText>
          Use the input text field below to edit the text shown to participants
          on the consent form screen.
        </RegularText>

        <View
          style={
            keyboardShow
              ? { ...styles.consentContainer, marginBottom: "100%" }
              : styles.consentContainer
          }
        >
          <TextInput
            placeholderTextColor="#4D4661"
            value={consentText}
            onChangeText={setConsentText}
            secureTextEntry={false}
            style={styles.consentTextInput}
            placeholder="consent text"
            multiline
          />
          <PrimaryButton
            onPress={saveConsentText}
            disabled={isLoading}
            text="Save Consent Text"
            style={styles.button}
          />
        </View>

        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  consentContainer: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    marginBottom: "15%",
  },
  consentTextInput: {
    width: "95%",
    height: "40%",
    flex: 1,
    borderWidth: 1,
    borderColor: "#4D4661",
    paddingHorizontal: 9,
    marginVertical: "4%",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "left",
    fontFamily: REGULAR_FONT,
  },
  view: {
    padding: "5%",
    width: "100%",
    height: "100%",
  },
  button: {
    width: "96%",
    marginVertical: 10,
    marginHorizontal: "2%",
  },
  header: {
    fontWeight: "500",
    fontSize: 20,
    marginVertical: 10,
  },
  paragraph: {
    marginVertical: 10,
  },
  error: {
    marginTop: 30,
  },
  loading: {
    position: "absolute",
    width: "110%",
    height: "110%",
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000099",
  },
});
