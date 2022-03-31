import { collection, getDocs } from "firebase/firestore";
import FirebaseInteractor from "./firebaseInteractor";

const fi = new FirebaseInteractor();

export async function wow() {
    return getDocs(collection(fi.db, "rounds"));
}