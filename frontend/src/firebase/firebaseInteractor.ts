import * as firebase from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updatePassword, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc, Timestamp, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { User, Word, Session, Round, GameType, UID } from "../models/types";
import { getRandomPairing, getTestDate, durstenfeldShuffle, getRandomGameType } from "../utils/utils";

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
    db = getFirestore(app);

    get email() {
        return this.auth.currentUser?.email ?? "Current user does not exist";
    }

    async createAccount(email: string, password: string) {
        let userAuth = await createUserWithEmailAndPassword(
            this.auth,
            email,
            password
        );

        if (userAuth.user?.uid == null) {
            throw new Error("No actual user");
        }

        sendEmailVerification(userAuth.user);
        
        const userDoc = doc(this.db, "users", userAuth.user.uid)
        
        await setDoc(userDoc, {
            numPairs: getRandomPairing(),
            gameType: getRandomGameType(),
            testDate: Timestamp.fromDate(getTestDate()),
        });
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
                email:    user.email                ?? "your mom",
                testDate: docData.testDate.toDate() ?? new Date(),
                numPairs: docData.numPairs          ?? 2,
                gameType: docData.gameType          ?? "pairing"
            }
        }

        throw new Error("No user found")
    }

    async startRound(sessionId: string): Promise<UID> {

        const user = this.auth.currentUser;

        if (user !== null) {
            const user = await this.getUser()

            const newRound: Round = {
                session: sessionId,
                startTime: new Date(),
                endTime: null,
                words: await this.getXRandomPairs(user.numPairs),
            }

            const col = collection(this.db, "rounds");
            const roundID: UID = (await addDoc(col, newRound)).id;
            
            return roundID;
        }

        throw new Error("No user found")
    }

    async endRound(roundId: UID) {
        const roundRef = collection(this.db, "rounds");
        await updateDoc(doc(roundRef, roundId), {
            endTime: new Date()
        })
    }

    async getRoundPairs(roundId: UID) {
        const roundsRef = collection(this.db, "rounds");
        const docData = (await getDoc(doc(roundsRef, roundId))).data();
        return docData?.words ?? [];
    }

    async startSession(): Promise<UID> {

        const user = this.auth.currentUser;

        if (user !== null) {

            const newSession: Session = {
                user: user.uid,
                startTime: new Date(),
                endTime: null,
            }

            const col = collection(this.db, "sessions");
            const sessionID: UID = (await addDoc(col, newSession)).id;
            
            return sessionID;
        }

        throw new Error("No user found")
    }

    async endSession(sessionId: UID) {
        const sessionsRef = collection(this.db, "sessions");
        await updateDoc(doc(sessionsRef, sessionId), {
            endTime: new Date()
        })
    }

    async getXRandomPairs(num: number): Promise<Word[]> {
        const col = collection(this.db, "words")
        const docs = await getDocs(col)
        let allWords: Word[] = docs.docs.map((doc) => doc.data()).map(({ english, turkish }) => ({ english, turkish }))
        durstenfeldShuffle(allWords)
        return allWords.slice(0, num)
    }
}
