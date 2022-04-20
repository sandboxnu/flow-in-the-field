import FirebaseInteractor from "./firebaseInteractor";
import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import { MailComposerOptions } from "expo-mail-composer";
import { RoundWithId } from "../models/types";

interface RoundData {
    "User Id": string,
    "Game Type": string,
    "Number of Words": string,
    "Session Id": string,
    "Round Id": string,
    "Round number in session": string,
    "Start time": string,
    "End time": string,
    "Duration (in seconds)": string,
    "Score": string
}

const fi = new FirebaseInteractor();
const cacheURI = `${FileSystem.cacheDirectory}/export.csv`

export async function generateRoundsCSV() {
    const orderedRoundsInSessions: { [sessionId: string]: RoundWithId[] } = await fi.getOrderedRoundsInSessions();
    const assembledRoundData: RoundData[] = [];

   await Promise.all(Object.keys(orderedRoundsInSessions).map(async (sessionId: string) => {
        const allRoundsInSession = orderedRoundsInSessions[sessionId];
        await Promise.all(allRoundsInSession.map(async (roundWithId: RoundWithId, index: number) => {
            const currentSession = await fi.getSessionById(sessionId)
            const userId = currentSession.user;
            const currentUser = await fi.getUserById(userId)
            const currentRound: RoundData = {
                "User Id": userId,
                "Game Type": currentUser.gameType,
                "Number of Words": currentUser.numPairs.toString(),
                "Session Id": sessionId,
                "Round Id": roundWithId.id,
                "Round number in session": (index + 1).toString(), // not 0-indexed
                "Start time": roundWithId.round.startTime.toISOString(),
                "End time": roundWithId.round.endTime ? roundWithId.round.endTime.toISOString() : "null",
                "Duration (in seconds)": roundWithId.round.endTime ? ((roundWithId.round.endTime.getTime() - roundWithId.round.startTime.getTime()) / 1000).toString() : "null",
                "Score": roundWithId.round.correctWords?.length.toString() ?? "0"
            }
            assembledRoundData.push(currentRound);
        }));
    }));
    
    return assembledRoundData;
}

const sendEmail = async (file: string) => {
    var options: MailComposerOptions = {
        subject: "Flow in the Field Exported Data",
        recipients: [],
        body: "Please add some indication of what data you are exporting here!",
        attachments: [file]
    }
    let promise = new Promise((resolve, reject) => {
        MailComposer.composeAsync(options)
            .then((result) => {
                resolve(result)
                FileSystem.deleteAsync(cacheURI)
            })
            .catch((error) => {
                reject(error)
                FileSystem.deleteAsync(cacheURI)
            })
    })
    promise.then(
        (result: any) => console.log("Status: email " + result.status),
        (error) => console.log("Status: email " + error)
    )
}

export async function promptExportEmail(toUnparse: Object[]) {
    const parsed = Papa.unparse(toUnparse, { newline: "\n" });
    FileSystem.writeAsStringAsync(cacheURI, parsed).then(async () => {
        console.log(`written to ${cacheURI}`)
    })
    sendEmail(cacheURI);
}