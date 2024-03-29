import Constants from "expo-constants";
import * as firebase from "firebase/app";
import {
  onAuthStateChanged,
  User as AuthUser,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signOut,
  Auth,
  connectAuthEmulator,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
  collection,
  getDocs,
  updateDoc,
  connectFirestoreEmulator,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

import { Role } from "../constants/role";
import {
  User,
  Word,
  Session,
  Round,
  UID,
  TestWord,
  TestSession,
  TestRound,
  RoundWithId,
  TestRoundWithId,
} from "../models/types";
import {
  getRandomPairing,
  getTestDate,
  durstenfeldShuffle,
  getRandomGameType,
  insertRoundInOrder,
} from "../utils/utils";
import _MetricsCollector from "./MetricsCollector";

const { manifest } = Constants;

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
const db = getFirestore(app);
const auth = getAuth(app);

if (manifest?.packagerOpts?.dev && manifest.debuggerHost) {
  const ip = manifest.debuggerHost.split(`:`).shift() ?? "localhost";
  console.log("Emulator IP: " + ip);
  connectFirestoreEmulator(db, ip, 8080);
  connectAuthEmulator(auth, `http://${ip}:9099`);
}

// Firebase Auth delay in email verification
const AUTH_DELAY = 60000; // in ms, equal to 1 minute

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
  metricsCollector = new _MetricsCollector(db);

  get email() {
    return this.auth.currentUser?.email ?? "Current user does not exist";
  }

  async checkIfVerified() {
    await this.auth.currentUser?.reload();
    return this.auth.currentUser?.emailVerified ?? false;
  }
  trySignedIn() {
    return new Promise((resolve: (value: AuthUser | null) => void, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
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
    this.lastEmailRequestedAt = new Date(Date.now());
    const userDoc = doc(this.db, "users", userAuth.user.uid);

    await setDoc(userDoc, {
      numPairs: getRandomPairing(),
      gameType: getRandomGameType(),
      testDate: Timestamp.fromDate(getTestDate()),
      role: Role.PARTICIPANT,
      hasGivenConsent: false,
      hasFinishedTutorial: false,
      testScore: null,
      testSessionId: null,
    });
  }

  // Delays resending the verification email to avoid Firebase too-many-requests error
  async resendEmailVerification() {
    const user = this.auth.currentUser;
    const now = new Date(Date.now());
    let timeDifference = this.lastEmailRequestedAt
      ? now.getTime() - this.lastEmailRequestedAt.getTime()
      : 0;
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

  async getUserById(userId: UID): Promise<User> {
    return (await getDoc(doc(this.db, "users", userId))).data() as User;
  }

  async getSessionById(sessionId: UID): Promise<Session> {
    return (
      await getDoc(doc(this.db, "sessions", sessionId))
    ).data() as Session;
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
        role: (docData.role as Role) ?? Role.PARTICIPANT,
        hasGivenConsent: docData.hasGivenConsent,
        hasFinishedTutorial: docData.hasFinishedTutorial,
        testScore: docData.testScore,
        testSessionId: docData.testSessionId,
      };
    }

    throw new Error("No user found");
  }

  async startRound(sessionId: string): Promise<UID> {
    const user = this.auth.currentUser;

    if (user !== null) {
      const user = await this.getUser();

      const newRound: Round = {
        session: sessionId,
        startTime: new Date(),
        endTime: null,
        words: await this.getXRandomPairs(user.numPairs),
        correctWords: null,
      };

      const roundID: UID = await this.metricsCollector.startRound(newRound);
      return roundID;
    }

    throw new Error("No user found");
  }

  async endRound(roundId: UID, correctWords: Word[] | null) {
    await this.metricsCollector.endRound(roundId, correctWords);
  }

  // Gets the correct words for a given round ID at a given moment from Firestore
  // This is necessary so that back button behavior does not overwrite correct answers
  // if a user exits on the feedback screen
  async getCorrectWords(roundId: UID) {
    const roundRef = collection(this.db, "rounds");
    const roundDoc = doc(roundRef, roundId);
    const correctWords = (await getDoc(roundDoc)).data()?.correctWords;

    return correctWords ? correctWords : null;
  }

  async getRoundPairs(roundId: UID) {
    const roundsRef = collection(this.db, "rounds");
    const docData = (await getDoc(doc(roundsRef, roundId))).data();
    return docData?.words ?? [];
  }

  async getAllRounds(): Promise<RoundWithId[]> {
    const allRounds = await getDocs(collection(this.db, "rounds"));
    const roundsWithIds: RoundWithId[] = [];

    allRounds.docs.forEach(
      async (roundDocSnapShot: QueryDocumentSnapshot<DocumentData>) => {
        roundsWithIds.push({
          id: roundDocSnapShot.id,
          round: this.correctTimeStamps(roundDocSnapShot.data()),
        });
      }
    );

    return roundsWithIds;
  }

  async getAllTestRounds(): Promise<TestRoundWithId[]> {
    const allRounds = await getDocs(collection(this.db, "testRounds"));

    const roundsWithIds: TestRoundWithId[] = allRounds.docs.map(
      (roundDocSnapshot) => ({
        id: roundDocSnapshot.id,
        ...this.correctTestRoundTimeStamps(roundDocSnapshot.data()),
      })
    );

    return roundsWithIds;
  }

  async getTestSessionById(id: string) {
    return (
      await getDoc(doc(this.db, "testSessions", id))
    ).data() as TestSession;
  }

  correctTestRoundTimeStamps(data: DocumentData): TestRound {
    return {
      testSession: data["testSession"],
      startTime: data["startTime"].toDate() as Date,
      endTime: (data["endTime"]?.toDate() as Date) ?? null,
      testWord: data["testWord"],
      questionNum: data["questionNum"],
      correct: data["correct"],
    };
  }

  // Firestore stores timestamps with more precision. This method returns the Round with proper Date objects to avoid casting errors
  correctTimeStamps(data: DocumentData): Round {
    return {
      session: data["session"],
      startTime: data["startTime"].toDate() as Date,
      endTime: data["endTime"] ? (data["endTime"].toDate() as Date) : null,
      words: data["words"],
      correctWords: data["correctWords"],
    };
  }

  // Returns a map of session id to an array of RoundWithIds in sorted order of start time of the rounds in that session
  async getOrderedRoundsInSessions(): Promise<{
    [sessionId: string]: RoundWithId[];
  }> {
    const allRounds: RoundWithId[] = await this.getAllRounds();
    const roundsInSession: { [sessionId: string]: RoundWithId[] } = {};

    allRounds.forEach((roundWithId: RoundWithId) => {
      const currentSessionRounds: RoundWithId[] =
        roundsInSession[roundWithId.round.session] ?? [];
      roundsInSession[roundWithId.round.session] = insertRoundInOrder(
        currentSessionRounds,
        roundWithId
      );
    });

    return roundsInSession;
  }

  async startSession(): Promise<UID> {
    const user = this.auth.currentUser;

    if (user !== null) {
      const newSession: Session = {
        user: user.uid,
        startTime: new Date(),
        endTime: null,
      };

      const sessionID: UID = await this.metricsCollector.startSession(
        newSession
      );
      return sessionID;
    }

    throw new Error("No user found");
  }

  async endSession(sessionId: UID) {
    await this.metricsCollector.endSession(sessionId);
  }

  async startTestRound(testSessionId: string, page: number): Promise<UID> {
    const user = this.auth.currentUser;

    if (user !== null) {
      const user = await this.getUser();

      const newTestRound: TestRound = {
        testSession: testSessionId,
        startTime: new Date(),
        endTime: null,
        testWord: await this.getTestWord(page),
        questionNum: page,
        correct: null,
      };

      const testRoundID: UID = await this.metricsCollector.startTestRound(
        newTestRound
      );
      return testRoundID;
    }

    throw new Error("No user found");
  }

  async endTestRound(testRoundId: UID, correct: boolean) {
    await this.metricsCollector.endTestRound(testRoundId, correct);
  }

  async getTestRoundPair(testRoundId: UID) {
    const testRoundsRef = collection(this.db, "testRounds");
    const docData = (await getDoc(doc(testRoundsRef, testRoundId))).data();
    return docData?.testWord;
  }

  async startTestSession(): Promise<UID> {
    const user = this.auth.currentUser;

    if (user !== null) {
      const newTestSession: TestSession = {
        user: user.uid,
        startTime: new Date(),
        endTime: null,
        score: null,
        correctWords: null,
      };

      const testSessionID: UID = await this.metricsCollector.startTestSession(
        newTestSession
      );
      return testSessionID;
    }

    throw new Error("No user found");
  }

  async getTestQuestions(): Promise<TestWord[]> {
    const testWords = collection(this.db, "testWords");
    const docs = await getDocs(testWords);
    const allTestWords: TestWord[] = docs.docs
      .map((doc) => doc.data())
      .map(({ turkish, english, correctlyPaired, question }) => ({
        turkish,
        english,
        correctlyPaired,
        question,
      }));
    return allTestWords;
  }

  async getTestWord(question: number): Promise<TestWord> {
    const col = collection(this.db, "testWords");
    const docs = await getDocs(col);
    const allTestWords: TestWord[] = docs.docs
      .map((doc) => doc.data())
      .map(({ correctlyPaired, english, question, turkish }) => ({
        correctlyPaired,
        english,
        question,
        turkish,
      }));
    const questionWord: TestWord[] = allTestWords.filter(
      (testWord) => testWord.question === question
    );
    return questionWord[0];
  }

  async endTestSession(
    testSessionId: UID,
    score: number,
    correctWords: TestWord[]
  ) {
    await this.metricsCollector.endTestSession(
      testSessionId,
      score,
      correctWords
    );

    const user = this.auth.currentUser;

    if (user === null) {
      throw new Error("No actual user");
    }

    const docData = (await getDoc(doc(this.db, "users", user.uid))).data();
    const userDoc = doc(this.db, "users", user.uid);

    if (docData === undefined) {
      throw new Error("No data found");
    }

    await updateDoc(userDoc, {
      testScore: score,
      testSessionId,
    });
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

  // Updates the state of hasGivenConsent for this user to be true
  async updateHasGivenConsent() {
    const user = this.auth.currentUser;

    if (user === null) {
      throw new Error("No actual user");
    }

    const docData = (await getDoc(doc(this.db, "users", user.uid))).data();
    const userDoc = doc(this.db, "users", user.uid);

    if (docData === undefined) {
      throw new Error("No data found");
    }

    await updateDoc(userDoc, {
      hasGivenConsent: true,
    });
  }

  // Get the consent text that is listed in Firestore
  async getConsentText(): Promise<string> {
    const copyTextRef = collection(this.db, "copyText");
    const docData = (await getDoc(doc(copyTextRef, "consentText"))).data();
    return docData?.text;
  }

  // Set the consent text that is listed in Firestore
  async setConsentText(consentText: string) {
    const docData = (
      await getDoc(doc(this.db, "copyText", "consentText"))
    ).data();
    const consentTextDoc = doc(this.db, "copyText", "consentText");

    if (docData === undefined) {
      throw new Error("No data found");
    }

    await updateDoc(consentTextDoc, {
      text: consentText,
    });
  }

  async getCompensation(): Promise<number> {
    const docSnapshot = await getDoc(doc(this.db, "copyText", "compensation"));
    if (!docSnapshot.exists()) {
      const defaultCompensation = 25;
      await this.setCompensation(defaultCompensation);
      return defaultCompensation;
    } else {
      return docSnapshot.data()?.value ?? 25;
    }
  }

  async setCompensation(compensation: number) {
    await setDoc(doc(this.db, "copyText", "compensation"), {
      value: compensation,
    });
  }

  // Updates the state of hasFinishedTutorial for this user to be true
  async updateHasFinishedTutorial() {
    const user = this.auth.currentUser;

    if (user === null) {
      throw new Error("No actual user");
    }

    const docData = (await getDoc(doc(this.db, "users", user.uid))).data();
    const userDoc = doc(this.db, "users", user.uid);

    if (docData === undefined) {
      throw new Error("No data found");
    }

    await updateDoc(userDoc, {
      hasFinishedTutorial: true,
    });
  }
}
