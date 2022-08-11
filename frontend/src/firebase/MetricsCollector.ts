import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  Round,
  Session,
  UID,
  Word,
  TestRound,
  TestSession,
  TestWord,
} from "../models/types";

/**
 * Tool to be used internally in the Firebase Interactor to manage metrics-specific data handling.
 * Ideally, shouldn't be called elsewhere in the app in order to maintain the pattern that the Firebase
 * Interactor is the only communicator with the datastore.
 */
export default class _MetricsCollector {
  db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  /**
   * Records start of round metrics
   * @param round the Round whose metrics to track
   * @returns the Firestore id of the stored round
   */
  async startRound(round: Round): Promise<UID> {
    const col = collection(this.db, "rounds");
    const doc = await addDoc(col, round);
    return doc.id;
  }

  /**
   * Records end of round metrics
   * @param roundId the id of the round to end
   */
  async endRound(roundId: UID, correctWords: Word[] | null) {
    const roundRef = collection(this.db, "rounds");
    const roundDoc = doc(roundRef, roundId);
    await updateDoc(roundDoc, {
      endTime: new Date(),
      correctWords,
    });
  }

  /**
   * Records start of session metrics
   * @param session the Session whose metrics to track
   * @returns the Firestore id of the stored session
   */
  async startSession(session: Session): Promise<UID> {
    const col = collection(this.db, "sessions");
    const doc = await addDoc(col, session);
    return doc.id;
  }

  /**
   * Records end of session metrics
   * @param sessionId the id of the session to end
   */
  async endSession(sessionId: UID) {
    const sessionsRef = collection(this.db, "sessions");
    await updateDoc(doc(sessionsRef, sessionId), {
      endTime: new Date(),
    });
  }

  /**
   * Records start of test round metrics
   * @param testRound the TestRound whose metrics to track
   * @returns the Firestore id of the stored test round
   */
  async startTestRound(testRound: TestRound): Promise<UID> {
    const col = collection(this.db, "testRounds");
    const doc = await addDoc(col, testRound);
    return doc.id;
  }

  /**
   * Records end of test round metrics
   * @param testRoundId the id of the test round to end
   */
  async endTestRound(testRoundId: UID, correct: boolean) {
    const testRoundRef = collection(this.db, "testRounds");
    const testRoundDoc = doc(testRoundRef, testRoundId);
    await updateDoc(testRoundDoc, {
      endTime: new Date(),
      correct,
    });
  }

  /**
   * Records start of test session metrics
   * @param testSession the TestSession whose metrics to track
   * @returns the Firestore id of the stored test session
   */
  async startTestSession(testSession: TestSession): Promise<UID> {
    const col = collection(this.db, "testSessions");
    const doc = await addDoc(col, testSession);
    return doc.id;
  }

  /**
   * Records end of test session metrics
   * @param testSessionId the id of the test session to end
   */
  async endTestSession(
    testSessionId: UID,
    score: number,
    correctWords: TestWord[]
  ) {
    const testSessionsRef = collection(this.db, "testSessions");
    await updateDoc(doc(testSessionsRef, testSessionId), {
      endTime: new Date(),
      score,
      correctWords,
    });
  }
}
