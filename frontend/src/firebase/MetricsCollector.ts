import { addDoc, collection, doc, Firestore, getDoc, updateDoc } from "firebase/firestore";
import { Round, Session, UID } from "../models/types";

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
        const doc = await addDoc(col, round)
        return doc.id
    }

    /**
     * Records end of round metrics
     * @param roundId the id of the round to end
     */
    async endRound(roundId: UID, points: number) {
        const roundRef = collection(this.db, "rounds");
        const roundDoc = doc(roundRef, roundId);
        const docData = (await getDoc(roundDoc)).data();
        const oldPoints = docData?.points ?? 0;
        await updateDoc(roundDoc, {
            endTime: new Date(),
            points: oldPoints + points
        })
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
            endTime: new Date()
        })
    }
}