import * as firebase from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { User, Word } from "../models/types";
import {
  getRandomPairing,
  getTestDate,
  durstenfeldShuffle,
  getRandomGameType,
} from "../utils/utils";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9cAIskIjacQRxhbJlJxJNizGOlbRj4gk",
  authDomain: "flowinthefield.firebaseapp.com",
  projectId: "flowinthefield",
  storageBucket: "flowinthefield.appspot.com",
  messagingSenderId: "788116866647",
  appId: "1:788116866647:web:0e2cbfc671576c8089c512",
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
    return this.auth.currentUser?.email ?? "Current user does not exis";
  }

  async checkIfVerified() {
    await this.auth.currentUser?.reload();
    return this.auth.currentUser?.emailVerified ?? false;
  }

  /**
   * Creates an account for a user, but does not store them in the db yet, since we don't know what we will store
   */
  async createAccount(email: string, password: string) {
    const userAuth = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    if (userAuth.user?.uid == null) {
      throw new Error("No actual user");
    }
    sendEmailVerification(userAuth.user);
    const userDoc = doc(this.db, "users", userAuth.user.uid);
    await setDoc(userDoc, {
      numPairs: getRandomPairing(),
      gameType: getRandomGameType(),
      testDate: Timestamp.fromDate(getTestDate()),
      sessions: [],
      seenPairs: [],
    });
  }

  async signInWithUsernameAndPassword(username: string, password: string) {
    await signInWithEmailAndPassword(this.auth, username, password);
  }

  async resetPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }

  async updatePassword(oldPassword: string, newPassword: string) {
    const user = this.auth.currentUser;
    if (user !== null && user.email !== null) {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
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
        throw new Error("No data found");
      }
      return {
        email: user.email!,
        testDate: docData.testDate.toDate(),
        numPairs: docData.numPairs,
        gameType: docData.gameType,
      };
    }
    throw new Error("No user found");
  }

  async getXRandomPairs(num: number): Promise<Word[]> {
    const col = collection(this.db, "words");
    const docs = await getDocs(col);
    const allWords: Word[] = docs.docs
      .map((doc) => doc.data())
      .map(({ english, turkish }) => ({ english, turkish }));
    durstenfeldShuffle(allWords);
    return allWords.slice(0, num);
  }
}
