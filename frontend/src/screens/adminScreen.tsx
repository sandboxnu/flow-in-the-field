import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import PrimaryButton from "../components/Button/PrimaryButton";
import ErrorText from "../components/Text/ErrorText";
import {
  generateRoundsCSV,
  generateTestRoundsCSV,
  promptExportEmail,
} from "../firebase/csvExporter";

export interface AdminScreenProps {
  route: any;
}

export default function AdminScreen(props: AdminScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setError] = useState<string | undefined>(undefined);

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
    <ScrollView style={styles.view}>
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
          The Test Data CSV will contain the following information for all test
          questions answered by participants:
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
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    padding: "5%",
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
