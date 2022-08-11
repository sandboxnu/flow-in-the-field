import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";

import PrimaryButton from "../components/Button/PrimaryButton";
import ErrorText from "../components/ErrorText";
import {
  generateRoundsCSV,
  generateTestRoundsCSV,
  promptExportEmail,
} from "../firebase/csv-export";

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
        <Text>
          Press the buttons below to export data as an email with a CSV
          attachment.
        </Text>

        <Text style={styles.header}>Practice Data</Text>

        <View style={styles.paragraph}>
          <Text>
            The Practice Data CSV will contain the following information for all
            practice rounds played by participants:
          </Text>
          <Text> • User ID</Text>
          <Text> • Game Type</Text>
          <Text> • Number of Turkish Words</Text>
          <Text> • Session ID</Text>
          <Text> • Round ID</Text>
          <Text> • Start Time</Text>
          <Text> • Duration</Text>
          <Text> • Score</Text>
        </View>

        <PrimaryButton
          onPress={async () => {
            await tryExport(generateRoundsCSV);
          }}
          disabled={isLoading}
          text="Export Practice CSV"
          style={styles.button}
        />

        <Text style={styles.header}>Test Data</Text>

        <View style={styles.paragraph}>
          <Text>
            The Test Data CSV will contain the following information for all
            test questions answered by participants:
          </Text>
          <Text> • Participant ID</Text>
          <Text> • Game Type</Text>
          <Text> • Test Session ID</Text>
          <Text> • Question Number</Text>
          <Text> • Start Time</Text>
          <Text> • End Time</Text>
          <Text> • Duration</Text>
          <Text> • Answer</Text>
          <Text> • Correctness</Text>
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

        <Text style={styles.header}>Edit Consent Form</Text>

        <Text>
          Use the input text field below to edit the text shown to participants
          on the consent form screen.
        </Text>

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
