import * as firebase from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getRandomPairing, getTestDate } from "../utils";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9cAIskIjacQRxhbJlJxJNizGOlbRj4gk",
    authDomain: "flowinthefield.firebaseapp.com",
    projectId: "flowinthefield",
    storageBucket: "flowinthefield.appspot.com",
    messagingSenderId: "788116866647",
    appId: "1:788116866647:web:0e2cbfc671576c8089c512"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

/**
 * A class to interact with firebase. This class stores the current state,
 * including a reference to the firestore, and the current authenticated user.
 * This adds a level of abstraction around firebase, so that this is the only object dealing with the server.
 * Stolen from vocab buddy.
 */
export default class FirebaseInteractor {
    auth = getAuth(app);
    db = getFirestore();

    /**
    * Creates an account for a user, but does not store them in the db yet, since we don't know what we will store
    */
    async createAccount(
        email: string,
        password: string,
    ) {
        let userAuth = await createUserWithEmailAndPassword(
            this.auth,
            email,
            password
        );
        if (userAuth.user?.uid == null) {
            throw new Error("No actual user");
        }
        sendEmailVerification(userAuth.user);
        await setDoc(doc(this.db, "users", userAuth.user.uid), {
            numPairs: getRandomPairing(),
            testDate: getTestDate(),
            sessions: [],
            seenPairs: []
        });
    }

    async signInWithUsernameAndPassword(username: string, password: string) {
        await signInWithEmailAndPassword(this.auth, username, password);
    }

    async resetPassword(email: string) {
        await sendPasswordResetEmail(this.auth, email)
    }
}