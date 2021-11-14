require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS)

const WORDS = require('./words/words.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

async function uploadWords() {
    for (let word of WORDS.words) {
        const res = await db.collection('words').add(word);
    }
}

uploadWords().then(() => console.log("Uploaded successfully.")).catch(console.log)
