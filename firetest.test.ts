import { connectAuthEmulator } from "@firebase/auth";
import { connectFirestoreEmulator } from "@firebase/firestore";
import FirebaseInteractor from "./firebase/firebaseInteractor";

let interactor = new FirebaseInteractor();
const db = interactor.db;
connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(interactor.auth, 'http://localhost:9099');
interactor.createAccount("test@sandboxnu.edu", "qwertyuiop");