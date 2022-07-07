import * as FileSystem from "expo-file-system";
import * as MailComposer from "expo-mail-composer";
import { MailComposerOptions } from "expo-mail-composer";
import Papa from "papaparse";

import { RoundWithId } from "../models/types";
import FirebaseInteractor from "./firebaseInteractor";

interface RoundData {
  "User Id": string;
  "Game Type": string;
  "Number of Words": string;
  "Session Id": string;
  "Round Id": string;
  "Round number in session": string;
  "Start time": string;
  "End time": string;
  "Duration (in seconds)": string;
  Score: string;
}

interface TestRoundData {
  "Participant ID": string;
  "Game Type": string;
  "Question Number": number;
  "Start Time": string;
  "End Time": string;
  Duration: number | "null";
  Answer: string;
  Correctness: string;
}

const fi = new FirebaseInteractor();
const cacheURI = `${FileSystem.cacheDirectory}/export.csv`;

export async function generateRoundsCSV() {
  const orderedRoundsInSessions: { [sessionId: string]: RoundWithId[] } =
    await fi.getOrderedRoundsInSessions();
  const assembledRoundData: RoundData[] = [];

  await Promise.all(
    Object.keys(orderedRoundsInSessions).map(async (sessionId: string) => {
      const allRoundsInSession = orderedRoundsInSessions[sessionId];
      await Promise.all(
        allRoundsInSession.map(
          async (roundWithId: RoundWithId, index: number) => {
            const currentSession = await fi.getSessionById(sessionId);
            const userId = currentSession.user;
            const currentUser = await fi.getUserById(userId);
            const currentRound: RoundData = {
              "User Id": userId,
              "Game Type": currentUser.gameType,
              "Number of Words": currentUser.numPairs.toString(),
              "Session Id": sessionId,
              "Round Id": roundWithId.id,
              "Round number in session": (index + 1).toString(), // not 0-indexed
              "Start time": roundWithId.round.startTime.toISOString(),
              "End time": roundWithId.round.endTime
                ? roundWithId.round.endTime.toISOString()
                : "null",
              "Duration (in seconds)": roundWithId.round.endTime
                ? (
                    (roundWithId.round.endTime.getTime() -
                      roundWithId.round.startTime.getTime()) /
                    1000
                  ).toString()
                : "null",
              Score:
                roundWithId.round.correctWords?.length.toString() ?? "null",
            };
            assembledRoundData.push(currentRound);
          }
        )
      );
    })
  );

  return assembledRoundData;
}

export async function generateTestRoundsCSV() {
  const allRounds = await fi.getAllTestRounds();
  return Promise.all(
    allRounds.map(async (round) => {
      const session = await fi.getTestSessionById(round.testSession);
      const user = await fi.getUserById(session.user);
      const result: TestRoundData = {
        "Participant ID": session.user,
        "Game Type": user.gameType,
        "Question Number": round.questionNum,
        "Start Time": round.startTime.toISOString(),
        "End Time": round.endTime?.toISOString() ?? "null",
        Duration: round.endTime
          ? round.endTime.getTime() - round.startTime.getTime()
          : "null",
        Answer: round.testWord.correctlyPaired,
        Correctness: optionalBoolToString(round.correct),
      };
      return result;
    })
  );
}

function optionalBoolToString(value: boolean | null) {
  if (value === null) return "null";
  if (value) return "Correct";
  return "Incorrect";
}

const sendEmail = async (file: string) => {
  const options: MailComposerOptions = {
    subject: "Flow in the Field Exported Data",
    recipients: [],
    body: "Please add some indication of what data you are exporting here!",
    attachments: [file],
  };
  const promise = new Promise((resolve, reject) => {
    MailComposer.composeAsync(options)
      .then((result) => {
        resolve(result);
        FileSystem.deleteAsync(cacheURI);
      })
      .catch((error) => {
        reject(error);
        FileSystem.deleteAsync(cacheURI);
      });
  });
  promise.then(
    (result: any) => console.log("Status: email " + result.status),
    (error) => console.log("Status: email " + error)
  );
};

export async function promptExportEmail(toUnparse: object[]) {
  const parsed = Papa.unparse(toUnparse, { newline: "\n" });
  await FileSystem.writeAsStringAsync(cacheURI, parsed);
  console.log(`written to ${cacheURI}`);
  await sendEmail(cacheURI);
}
