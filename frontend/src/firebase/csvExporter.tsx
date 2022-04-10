import { collection, getDocs } from "firebase/firestore";
import FirebaseInteractor from "./firebaseInteractor";
import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import { MailComposerOptions } from "expo-mail-composer";

const fi = new FirebaseInteractor();

const testJson = [
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

const sendEmail = async (file: string) => {
    var options: MailComposerOptions = {
        subject: "Sending email with attachment",
        recipients: [],
        body: "its a test!",
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

export async function promptExportEmail() {
    const parsed = Papa.unparse(testJson, { newline: "\n" });
    console.log(parsed);
    FileSystem.writeAsStringAsync(cacheURI, parsed).then(() => {
        console.log(`written to ${cacheURI}`)
    })
    sendEmail(cacheURI).then(() => console.log('email sent'));
    // TODO: Delete file after sending email
}