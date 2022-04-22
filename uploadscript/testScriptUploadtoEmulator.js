const admin = require('firebase-admin');

const TESTWORDS = require('./words/testWords.json');

// initialization
const projectId = 'flowinthefield';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
admin.initializeApp({ projectId });

const db = admin.firestore();

async function uploadTestWords() {
    for (let word of TESTWORDS.testWords) {
        const res = await db.collection('testWords').add(word);
    }
}

uploadTestWords().then(() => console.log("Uploaded successfully.")).catch(console.log)
