require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS)

const TESTWORDS = require('./words/testWords.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

async function uploadTestWords() {
    for (let word of TESTWORDS.testWords) {
        const res = await db.collection('testWords').add(word);
    }
}

uploadTestWords().then(() => console.log("Uploaded successfully.")).catch(console.log)
