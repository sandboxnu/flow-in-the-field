import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import FirebaseInteractor from "./firebaseInteractor";
import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import { MailComposerOptions } from "expo-mail-composer";
import { Round } from "../models/types";

interface RoundData {
    "User Id": string,
    "Game Type": string,
    "Number of Words": string,
    "Session Id": string,
    "Round Id": string,
    "Round number in session": string,
    "Start time": string,
    "End time": string,
    "Duration": string,
    "Score": string
}

const fi = new FirebaseInteractor();

// TODO: remove this when actual data is usable
export const testJson = [
    {
        "Column 1": "1-1",
        "Column 2": "1-2",
        "Column 3": "1-3",
        "Column 4": "1-4"
    },
    {
        "Column 1": "2-1",
        "Column 2": "2-2",
        "Column 3": "2-3",
        "Column 4": "2-4"
    },
    {
        "Column 1": "3-1",
        "Column 2": "3-2",
        "Column 3": "3-3",
        "Column 4": "3-4"
    },
    {
        "Column 1": 4,
        "Column 2": 5,
        "Column 3": 6,
        "Column 4": 7
    }
]

const cacheURI = `${FileSystem.cacheDirectory}/export.csv`

export async function generateRoundsCSV() {
    const roundData = await fi.getAllRounds();
    const assembledRoundData: RoundData[] = [];
    roundData.docs.forEach(async (roundDocSnapShot: QueryDocumentSnapshot<DocumentData>) => { // TODO: This is leaky
        const roundDoc = roundDocSnapShot.data() as Round;
        const currentSession = await fi.getSessionById(roundDoc.session)
        const userId = currentSession.user;
        const currentUser = await fi.getUserById(userId)
        const currentRound: RoundData = {
            "User Id": userId,
            "Game Type": currentUser.gameType,
            "Number of Words": currentUser.numPairs.toString(),
            "Session Id": roundDoc.session,
            "Round Id": roundDocSnapShot.id,
            "Round number in session": "", // TODO: Pull this out into a cache-type thing
            "Start time": roundDoc.startTime.toString(),
            "End time": roundDoc.endTime?.toString() ?? "null",
            "Duration": "", // TODO
            "Score": roundDoc.correctWords?.length.toString() ?? "0"
        }
        console.log(currentRound);
        assembledRoundData.push(currentRound)
    });
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
            })
            .catch((error) => {
                reject(error)
            })
    })
    promise.then(
        (result: any) => console.log("Status: email " + result.status),
        (error) => console.log("Status: email " + error)
    )
}

export async function promptExportEmail(toUnparse: Object[]) {
    const parsed = Papa.unparse(toUnparse, { newline: "\n" });
    console.log(parsed);
    FileSystem.writeAsStringAsync(cacheURI, parsed).then(() => {
        console.log(`written to ${cacheURI}`)
    })
    sendEmail(cacheURI).then(() => console.log('email sent'));
    // TODO: Delete file after sending email
}