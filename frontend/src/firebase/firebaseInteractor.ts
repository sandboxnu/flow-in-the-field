import * as firebase from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updatePassword, signOut, Auth, connectAuthEmulator } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc, Timestamp, collection, getDocs, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { User, Word } from "../models/types";
import { getRandomPairing, getTestDate, durstenfeldShuffle, getRandomGameType } from "../utils/utils";
import Constants from "expo-constants";

const { manifest } = Constants;

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
const db = getFirestore(app);
const auth = getAuth(app);

if (manifest?.packagerOpts?.dev && manifest.debuggerHost) {
    const ip = manifest.debuggerHost.split(`:`).shift() ?? "localhost";
    console.log("Emulator IP: " + ip);
    connectFirestoreEmulator(db, ip, 8080);
    connectAuthEmulator(auth, `http://${ip}:9099`,);
}

// Firebase Auth delay in email verification
const AUTH_DELAY = 60000 // in ms, equal to 1 minute

/**
 * A class to interact with firebase. This class stores the current state,
 * including a reference to the firestore, and the current authenticated user.
 * This adds a level of abstraction around firebase, so that this is the only object dealing with the server.
 * Stolen from vocab buddy.
 */
export default class FirebaseInteractor {
    lastEmailRequestedAt?: Date;
    db = db;
    auth = auth;

    get email() {
        return this.auth.currentUser?.email ?? "Current user does not exis";
    }

    async checkIfVerified() {
        await this.auth.currentUser?.reload();
        return this.auth.currentUser?.emailVerified ?? false;
    }
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
        this.lastEmailRequestedAt = new Date(Date.now());
        const userDoc = doc(this.db, "users", userAuth.user.uid)
        await setDoc(userDoc, {
            numPairs: getRandomPairing(),
            gameType: getRandomGameType(),
            testDate: Timestamp.fromDate(getTestDate()),
            sessions: [],
            seenPairs: []
        });
    }

    // Delays resending the verification email to avoid Firebase too-many-requests error
    async resendEmailVerification() {
        const user = this.auth.currentUser;
        let now = new Date(Date.now());
        let timeDifference = this.lastEmailRequestedAt ? now.getTime() - this.lastEmailRequestedAt.getTime() : 0;
        timeDifference = timeDifference < 0 ? 0 : timeDifference; // sanity check that difference is nonnegative

        if (user === null) {
            throw new Error("No actual user");
        }

        this.lastEmailRequestedAt = new Date(Date.now());
        setTimeout(() => {
            sendEmailVerification(user);
        }, AUTH_DELAY - timeDifference);
    }

    async signInWithUsernameAndPassword(username: string, password: string) {
        await signInWithEmailAndPassword(this.auth, username, password);
    }

    async resetPassword(email: string) {
        await sendPasswordResetEmail(this.auth, email)
    }
    async updatePassword(oldPassword: string, newPassword: string) {
        const user = this.auth.currentUser;
        if (user !== null && user.email !== null) {
            const credential = EmailAuthProvider.credential(
                user.email,
                oldPassword
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
        } else {
            console.log("failed to update password");
        }
    }
    async logout() {
        await signOut(this.auth);
    }

    async getUser(): Promise<User> {
        const user = this.auth.currentUser;
        if (user !== null) {
            const docData = (await getDoc(doc(this.db, "users", user.uid))).data();
            if (docData === undefined) {
                throw new Error("No data found")
            }
            return {
                email: user.email!,
                testDate: docData.testDate.toDate(),
                numPairs: docData.numPairs,
                gameType: docData.gameType
            }
        }
        throw new Error("No user found")
    }

    async getXRandomPairs(num: number): Promise<Word[]> {
        const col = collection(this.db, "words")
        const docs = await getDocs(col)
        let allWords: Word[] = docs.docs.map((doc) => doc.data()).map(({ english, turkish }) => ({ english, turkish }))
        durstenfeldShuffle(allWords)
        return allWords.slice(0, num)
    }
}
