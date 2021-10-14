import * as firebase from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, DocumentData } from "firebase/firestore";
import { User } from "../models/types";


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
    currentUser: User | null = null;
    /**
    * Creates an account for a user
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
    }

    async signInWithUsernameAndPassword(username: string, password: string) {
        // idk what this do - robert
        // this.unsubscribe?.apply(this);

        await signInWithEmailAndPassword(this.auth, username, password);
        await this.createCurrentUser();
    }

    async createCurrentUser() {
        try {
            this.currentUser = await this.getUser(undefined);
        } catch (error) {
            // Hopefully this does not happen.
            console.log(error);
        }
    }

    async getUser(id: string | undefined): Promise<User> {
        let idToUse = id || this.auth.currentUser?.uid;
        let user = await getDoc(doc(collection(this.db, "users"), idToUse));

        let userData = user.data();
        if (idToUse != null && userData != null) {
            return this.getUserFromData(idToUse, userData);
        } else {
            throw new Error("Invalid user");
        }
    }
    // given a user document, returns a user object
    getUserFromData(id: string, userData: DocumentData): User {
        return {
            id: id,
            sessionId: userData.sessionId === undefined ? -1 : userData.sessionId,
        };
    }

}